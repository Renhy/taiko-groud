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
                leftDo: -1000,
                rightDo: -1000,
                leftKa: -1000,
                rightKa: -1000,
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
        this.scorekeeper.readMusic();
    }

    end() {
        this.ended = true;
        console.log('Music ended.');
        this.endCallback();
    }

    beat(key) {
        let record = {
            value: BeatType.DO,
            ts: key.ts,
            daiNote: false,
        };
        switch (key.value) {
            case Keys.LEFT_DO:
                this.state.play.leftDo = key.ts;
                record.value = BeatType.DO;
                break;
            case Keys.RIGHT_DO:
                this.state.play.rightDo = key.ts;
                record.value = BeatType.DO;
                break;
            case Keys.LEFT_KA:
                this.state.play.leftKa = key.ts;
                record.value = BeatType.KA;
                break;
            case Keys.RIGHT_KA:
                this.state.play.rightKa = key.ts;
                record.value = BeatType.KA;
                break;
        }

        if (this.state.play.balloon) {
            this.state.play.hitCount += 1;
            this.game.plotter.overlay.roll.update();
            this.scorekeeper.scoreBalloon(key.ts);
            if (this.state.play.hitCount >= this.music.balloonCounts[this.index.balloon]) {
                this.index.balloon += 1;

                this.audioPlayer.play(Audios.BALLOON);
                this.state.play.balloon = false;
                this.state.play.hitCount = 0;
                this.scorekeeper.scoreBalloonResult(JudgeResult.GOOD, key.ts);
                this.game.plotter.overlay.roll.close();
            }
            return;
        }
        if (this.state.play.drumroll) {
            this.records.push(record);
            this.state.play.hitCount += 1;
            this.game.plotter.overlay.roll.update();
            this.scorekeeper.scoreDrumroll(key.ts);
            return;
        }
        if (this.state.play.daiDrumroll) {
            record.daiNote = true;
            this.records.push(record);
            this.state.play.hitCount += 1;
            this.game.plotter.overlay.roll.update();
            this.scorekeeper.scoreDaiDrumroll(key.ts);
            return;
        }

        if (this.currentBeat.type == BeatType.DO) {
            if (key.value == Keys.LEFT_DO ||
                key.value == Keys.RIGHT_DO) {
                if (this.checkSimpleBeat(key)) {
                    this.records.push(record);
                }
            }
            return;
        }
        if (this.currentBeat.type == BeatType.KA) {
            if (key.value == Keys.LEFT_KA ||
                key.value == Keys.RIGHT_KA) {
                if (this.checkSimpleBeat(key)) {
                    this.records.push(record);
                }
            }
            return;
        }

        if (this.currentBeat.type == BeatType.DAI_DO) {
            if (key.value == Keys.LEFT_DO ||
                key.value == Keys.RIGHT_DO) {
                if (this.checkSimpleDaiBeat(key)) {
                    if (this.state.play.hitCount == 1) {
                        record.daiNote = true;
                        this.records.push(record);
                    }
                }
            }
            return;
        }
        if (this.currentBeat.type == BeatType.DAI_KA) {
            if (key.value == Keys.LEFT_KA ||
                key.value == Keys.RIGHT_KA) {
                if (this.checkSimpleDaiBeat(key)) {
                    if (this.state.play.hitCount == 1) {
                        record.daiNote = true;
                        this.records.push(record);
                    }
                }
            }
            return;
        }
     
    }

    checkSimpleBeat(key) {
        if (key.ts < this.currentBeat.ts - JudgeBias.OK) {
            return false;
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
        this.state.play.combo += 1;
        this.game.plotter.overlay.combo.update();

        return true;
    }

    checkSimpleDaiBeat(key) {
        if (key.ts < this.currentBeat.ts - JudgeBias.OK) {
            return false;
        }

        let result = JudgeResult.OK;
        if (key.ts >= this.currentBeat.ts - JudgeBias.GOOD &&
            key.ts <= this.currentBeat.ts + JudgeBias.GOOD) {
            result = JudgeResult.GOOD;
        }

        this.state.judge.result = result;
        this.state.judge.ts = key.ts;
        this.scorekeeper.scoreBeat(this.index.beat, this.state.judge.result, key.ts);

        this.state.play.hitCount += 1;
        if (this.state.play.hitCount >= 2) {
            this.state.play.hitCount = 0;

            this.index.beat += 1;
            this.currentBeat = this.music.beats[this.index.beat];
        } else {
            this.state.play.combo += 1;
            this.game.plotter.overlay.combo.update();
        }

        return true;
    }



/**************************************************************/
/******************* update referee per frame  ********************/

    update(delta) {
        if (this.ended) {
            return;
        }
        this.checkMusic(delta);
    }

    checkMusic(delta) {
        let currentMeasure = this.music.measures[this.index.measure];
        if (delta > currentMeasure.start + currentMeasure.duration) {
            this.index.measure += 1;
            if (this.index.measure >= this.music.measures.length) {
                this.end();
                return;
            }
            this.startMeasure(this.index.measure);
        }

        if (this.index.beat >= this.music.beats.length) {
            return;
        }

        if (this.currentBeat.type == BeatType.BALLOON || 
            this.currentBeat.type == BeatType.DRUMROLL || 
            this.currentBeat.type == BeatType.DAI_DRUMROLL) {
            if (delta > this.currentBeat.ts) {
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

    startMeasure(index) {
        let commands = this.music.measures[index].commands;
        for (let command of commands) {
            console.log(command);
            if (command == 'GOGOSTART') {
                this.state.play.gogoTime = true;
                this.scorekeeper.gogoStart();
                continue;
            }
            if (command == 'GOGOEND') {
                this.state.play.gogoTime = false;
                this.scorekeeper.gogoEnd();
                continue;
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
                this.game.plotter.overlay.combo.break();
                this.scorekeeper.badBeat(this.index.beat);
                break;
            case BeatType.DAI_DO:
            case BeatType.DAI_KA:
                if (this.state.play.hitCount == 0) {
                    this.state.judge.result = JudgeResult.BAD;
                    this.state.judge.ts = delta;
                    this.state.play.combo = 0;
                    this.game.plotter.overlay.combo.break();
                    this.scorekeeper.badBeat(this.index.beat);
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
                if (this.state.play.drumroll || this.state.play.daiDrumroll) {
                    this.game.plotter.overlay.roll.close(true);
                } else {
                    this.game.plotter.overlay.roll.close();
                }
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