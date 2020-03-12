import { Keys } from "./keyboard.js";
import { BeatType, JudgeBias, JudgeResult } from './constant.js';
import { Music } from "./music.js";
import { Audios } from "./audio-player.js";

export class Referee {
    constructor(audioPlayer, callback) {
        this.audioPlayer = audioPlayer;
        this.endCallback = callback;
        this.index = {
            measure: 0,
            balloon: 0,
            beat: 0,
            beatResult: BeatResult.NONE,
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
            nextBeats: []
        };

        this.records = [];
        this.music = new Music();
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
                this.play.leftDo = key.ts;
                break;
            case Keys.RIGHT_DO:
                this.play.rightDo = key.ts;
                break;
            case Keys.LEFT_KA:
                this.play.leftKa = key.ts;
                break;
            case Keys.RIGHT_KA:
                this.play.rightKa = key.ts;
                break;
        }

        if (this.state.play.balloon) {
            this.state.play.hitcount += 1;
            if (this.state.play.hitCount >= this.music.balloonCounts[this.index.balloon]) {
                this.audioPlayer.play(Audios.BALLOON);
                this.state.play.balloon = false;
                this.state.play.hitCount = 0;
            }
        }
        if (this.state.play.drumroll || this.state.play.daiDrumroll) {
            this.state.play.hitCount += 1;
        }
    }

    readState(delta) {
        this.checkMusic(delta);
        this.updateNextBeats(delta);

        return this.state;
    }

    checkMusic(delta) {
        let currentMeasure = this.music.measures[this.index.measure];
        if (deltaTime > currentMeasure.start + currentMeasure.duration) {
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
                this.judgeBeat(delta);
                return;
            }
        } else {
            if (delta > this.currentBeat.ts + JudgeBias.OK) {
                this.judgeBeat(delta);
                return;
            }
        }
    }

    updateNextBeats(delta) {
        let stopTs = delta + this.music.measures[this.index.measure].duration;
        let distancePerTime = 1 / this.music.measures[this.index.measure].duration;

        let beats = [];
        for (let i = this.index.beat; i < this.music.beats.length; i++) {
            if (this.music.beats[i] > stopTs) {
                break;
            }

            beats.push({
                distance: (this.music.beats[i].ts - delta) * distancePerTime,
                type: this.music.beats[i],
            })
        }

        this.state.nextBeats = beats;
    }

    judgeBeat(delta) {
        switch (this.currentBeat.type) {
            case BeatType.DO:
            case BeatType.KA:
            case BeatType.DAI_DO:
            case BeatType.DAI_KA:
                this.state.judge.result = JudgeResult.BAD;
                this.state.judge.ts = delta;
                this.state.play.combo = 0;
                break;
            case BeatType.DRUMROLL:
                this.state.play.drumroll = true;
                break;
            case BeatType.DAI_DRUMROLL:
                this.state.play.daiDrumroll = true;
                break;
            case BeatType.BALLOON:
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
    }


}