import { JudgeResult, BeatType, BeatMap, CourseType } from "./constant.js";



export class Scorekeeper {

    constructor(game) {
        this.game = game;
        this.score = 0;
        this.completeness = 0;

        this.gauge = {
            total: 0,
            value: 0,
            gain: {
                good: 1,
                ok: 0.5,
                bad: -2,
            },
            light: 0,
            threshold: 40,
        };

        this.gain = 1;
        this.equivalent = 1000;

        this.addTime = -1000;
        this.addValue = 0;
    }

    readMusic() {
        let music = this.game.referee.music;
        let type = music.type;

        let c = 0;
        let isggt = 1;
        for (let measure of music.measures) {
            for (let command of measure.commands) {
                if (command == 'GOGOSTART') {
                    isggt = 1.2; 
                }
                if (command == 'GOGOEND') {
                    isggt = 1;
                }
            }

            for (let beat of measure.line) {
                if (BeatMap[beat] == BeatType.DO ||
                    BeatMap[beat] == BeatType.KA) {
                        this.gauge.total += 1;
                        c += 3 * isggt;
                    }

                if (BeatMap[beat] == BeatType.DAI_DO ||
                    BeatMap[beat] == BeatType.DAI_KA) {
                        this.gauge.total += 1;
                        c += 6 * isggt;
                    }
            }
        }

        this.equivalent = 1000000 / c;
        this.equivalent = Math.ceil(this.equivalent / 50) * 50;



        if (type == CourseType.EXTREME ||
            type == CourseType.EXTREME) {
            this.gauge.threshold = 39;
            this.gauge.total *= 0.56;
            this.gauge.gain.ok = 0.5;
            this.gauge.gain.bad = -2;
        }
        if (type == CourseType.HARD) {
            this.gauge.threshold = 39;
            this.gauge.total *= 0.48;
            this.gauge.gain.ok = 0.75;
            this.gauge.gain.bad = -1.25
        }
        if (type == CourseType.NORMAL ||
            type == CourseType.EASY) {
            this.gauge.threshold = 29;
            this.gauge.total *= 0.45;
            this.gauge.gain.ok = 0.75;
            this.gauge.gain.bad = -0.5;
        }

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

        if (this.gauge.value < this.gauge.total) {
            if (result == JudgeResult.GOOD) {
                this.gauge.value += 1;
            } else {
                this.gauge.value += this.gauge.gain.ok;
            }
            this.updateGaugeLight();
        }
    }

    badBeat(index) {
        if (this.gauge.value > 0) {
            this.gauge.value += this.gauge.gain.bad;
            this.updateGaugeLight();
        }
    }

    updateGaugeLight() {
        if (this.gauge.value > this.gauge.total) {
            this.gauge.light = 50;
            return;
        }
        if (this.gauge.value < 0) {
            this.gauge.linge = 0;
            return;
        }
        this.gauge.light = 
            Math.floor(this.gauge.value / this.gauge.total * 50);

    }

    scoreBalloon(ts) {
        this.addScore(100 * this.gain, ts);
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