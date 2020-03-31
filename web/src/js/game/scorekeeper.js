import { JudgeResult, BeatType } from "./constant.js";



export class Scorekeeper {

    constructor(game) {
        this.game = game;
        this.score = 0;
        this.completeness = 0;

        this.gain = 1;
        this.equivalent = 1000;

        this.addTime = -1000;
        this.addValue = 0;
    }

    gogoStart() {
        this.gain = 1.2;
    }

    gogoEnd() {
        this.gain = 1;
    }

    scoreBeat(index, result, ts) {
        let s = this.equivalent * this.gain;
        if (result == JudgeResult.GOOD) {
            s *= 3;
        }
        if (this.game.referee.music.beats[index].type == BeatType.DAI_DO || 
            this.game.referee.music.beats[index].type == BeatType.DAI_KA) {
            s *= 2;
        }

        this.addScore(s, ts);
    }

    scoreBalloonResult(type, ts) {
        if (type == JudgeResult.GOOD) {
            this.addScore(5000 * this.gain, ts);
        } else {
            this.addScore(1000 * this.gain, ts);
        }
    }

    scoreDrumroll(ts) {
        this.addScore(100 * this.gain, ts);
    }

    scoreDaiDrumroll(ts) {
        this.addScore(200 * this.gain, ts);
    }

    addScore(value, ts) {
        this.addValue = value;
        this.addTime = ts;
        this.game.plotter.overlay.score.add.innerHTML = value;

        this.score += value;
        this.game.plotter.overlay.score.total.innerHTML = this.score;
    }


}