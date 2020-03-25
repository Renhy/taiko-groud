import { JudgeResult, BeatType } from "./constant.js";



export class Scorekeeper {

    constructor(game) {
        this.game = game;
        this.score = 0;
        this.completeness = 0;

        this.gain = 1;
        this.equivalent = 1000;
    }

    scoreBeat(index, result) {
        let s = this.equivalent * this.gain;
        if (result == JudgeResult.GOOD) {
            s *= 3;
        }
        if (this.game.referee.music.beats[index].type == BeatType.DAI_DO || 
            this.game.referee.music.beats[index].type == BeatType.DAI_KA) {
            s *= 2;
        }

        this.addScore(s);
    }

    scoreBalloonResult(type) {

    }

    scoreDrumroll() {

    }

    scoreDaiDrumroll() {

    }

    addScore(value) {
        this.score += value;
        this.game.plotter.overlay.score.innerHTML = this.score;
    }


}