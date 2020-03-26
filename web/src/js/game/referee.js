import { Keys } from "../keyboard.js";
import { BeatType, JudgeBias, JudgeResult } from './constant.js';
import { Music } from "./music.js";
import { Audios } from "../audio-player.js";
import { Scorekeeper } from "./scorekeeper.js";

export class Referee {
    constructor(game, audioPlayer, callback) {
        this.game = game;
        this.audioPlayer = audioPlayer;
        this.endCallback = callback;
        this.index = {
            measure: 0, 
            balloon: 0,
            beat: 0,
        }

        this.state = {
            play: {
                leftDo: -1,
                rightDo: -1,
                leftKa: -1,
                rightKa: -1,
                combo: 0,
                gogoTime: false,
                balloon: false,
                drumroll: false,
                daiDrumroll: false,
                hitCount: 0,
            },
            judge: {
                ts: 0,
                result: JudgeResult.NONE,
            },
        };

        this.records = [];
        this.music = new Music();
        this.scorekeeper = new Scorekeeper(this.game);
    }

    async loadMusic(url, type) {
        await this.music.init(url, type);
        this.currentBeat = this.music.beats[this.index.beat];
    }

    end() {
        console.log('Music ended.');
        this.endCallback();
    }

    beat(key) {
        this.records.push(key);
        switch (key.value) {
            case Keys.LEFT_DO:
                this.state.play.leftDo = key.ts;
                break;
            case Keys.RIGHT_DO:
                this.state.play.rightDo = key.ts;
                break;
            case Keys.LEFT_KA:
                this.state.play.leftKa = key.ts;
                break;
            case Keys.RIGHT_KA:
                this.state.play.rightKa = key.ts;
                break;
        }

        if (this.state.play.balloon) {
            this.state.play.hitcount += 1;
            this.scorekeeper.scoreBalloon(key.ts);
            if (this.state.play.hitCount >= this.music.balloonCounts[this.index.balloon]) {
                this.audioPlayer.play(Audios.BALLOON);
                this.state.play.balloon = false;
                this.state.play.hitCount = 0;
                this.scorekeeper.scoreBalloonResult(JudgeResult.GOOD, key.ts);
            }
            return;
        }
        if (this.state.play.drumroll) {
            this.state.play.hitCount += 1;
            this.scorekeeper.scoreDrumroll(key.ts);
            return;
        }
        if (this.state.play.daiDrumroll) {
            this.state.play.hitCount += 1;
            this.scorekeeper.scoreDaiDrumroll(key.ts);
            return;
        }

        if (this.currentBeat.type == BeatType.DO) {
            if (key.value == Keys.LEFT_DO ||
                key.value == Keys.RIGHT_DO) {
                this.checkSimpleBeat(key);
            }
            return;
        }
        if (this.currentBeat.type == BeatType.KA) {
            if (key.value == Keys.LEFT_KA ||
                key.value == Keys.RIGHT_KA) {
                this.checkSimpleBeat(key);
            }
            return;
        }

        if (this.currentBeat.type == BeatType.DAI_DO) {
            if (key.value == Keys.LEFT_DO ||
                key.value == Keys.RIGHT_DO) {
                this.checkSimpleDaiBeat(key);
            }
            return;
        }
        if (this.currentBeat.type == BeatType.DAI_KA) {
            if (key.value == Keys.LEFT_KA ||
                key.value == Keys.RIGHT_KA) {
                this.checkSimpleDaiBeat(key);
            }
            return;
        }
     
    }

    checkSimpleBeat(key) {
        if (key.ts < this.currentBeat.ts - JudgeBias.OK) {
            return;
        }

        let result = JudgeResult.OK;
        if (key.ts >= this.currentBeat.ts - JudgeBias.GOOD &&
            key.ts <= this.currentBeat.ts + JudgeBias.GOOD) {
            result = JudgeResult.GOOD;
        }

        this.state.judge.result = result;
        this.state.judge.ts = key.ts;
        this.scorekeeper.scoreBeat(this.index.beat, result, key.ts);

        this.index.beat += 1;
        this.currentBeat = this.music.beats[this.index.beat];
    }

    checkSimpleDaiBeat(key) {
        if (key.ts < this.currentBeat.ts - JudgeBias.OK) {
            return;
        }

        let result = JudgeResult.OK;
        if (key.ts >= this.currentBeat.ts - JudgeBias.GOOD &&
            key.ts <= this.currentBeat.ts + JudgeBias.GOOD) {
            result = JudgeResult.GOOD;
        }
        if (result > this.state.judge.result) {
            this.state.judge.result = result;
            this.state.judge.ts = key.ts;
        }
        this.scorekeeper.scoreBeat(this.index.beat, this.state.judge.result, key.ts);

        this.state.play.hitCount += 1;
        if (this.state.play.hitCount >= 2) {
            this.state.play.hitCount = 0;

            this.index.beat += 1;
            this.currentBeat = this.music.beats[this.index.beat];
        }

    }


/**************************************************************/
/******************* update referee per frame  ********************/

    update(delta) {
        this.checkMusic(delta);
    }

    checkMusic(delta) {
        let currentMeasure = this.music.measures[this.index.measure];
        if (delta > currentMeasure.start + currentMeasure.duration) {
            this.index.measure += 1;
            if (this.index.measure >= this.music.measures.length) {
                this.end();
            }
        }

        if (this.index.beat >= this.music.beats.length) {
            return;
        }

        if (this.currentBeat.type == BeatType.BALLOON || 
            this.currentBeat.type == BeatType.DRUMROLL || 
            this.currentBeat.type == BeatType.DAI_DRUMROLL) {
            if (delta > this.currentBeat.ts - JudgeBias.OK) {
                this.closeBeat(delta);
                return;
            }
        } else {
            if (delta > this.currentBeat.ts + JudgeBias.OK) {
                this.closeBeat(delta);
                return;
            }
        }
    }

    closeBeat(delta) {
        switch (this.currentBeat.type) {
            case BeatType.DO:
            case BeatType.KA:
                this.state.judge.result = JudgeResult.BAD;
                this.state.judge.ts = delta;
                this.state.play.combo = 0;
                break;
            case BeatType.DAI_DO:
            case BeatType.DAI_KA:
                if (this.state.play.hitCount == 0) {
                    this.state.judge.result = JudgeResult.BAD;
                    this.state.judge.ts = delta;
                    this.state.play.combo = 0;
                }
                this.state.play.hitCount = 0;
                break;
            case BeatType.DRUMROLL:
                this.state.play.hitCount = 0;
                this.state.play.drumroll = true;
                break;
            case BeatType.DAI_DRUMROLL:
                this.state.play.hitCount = 0;
                this.state.play.daiDrumroll = true;
                break;
            case BeatType.BALLOON:
                this.state.play.hitCount = 0;
                this.state.play.balloon = true;
                break;
            case BeatType.END:
                this.state.play.balloon = false;
                this.state.play.drumroll = false;
                this.state.play.daiDrumroll = false;
                this.state.play.hitCount = 0;
                break;
        }

        this.index.beat += 1;
        this.currentBeat = this.music.beats[this.index.beat];

    }

}