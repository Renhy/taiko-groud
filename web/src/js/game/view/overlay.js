import { CourseType } from "../constant.js";
import { Combo } from "./combo.js";
import { Score } from "./score.js";
import { Roll } from "./roll.js";

var Layout = {
    title: {
        height: 60 / 720,
        stroke: 4 / 720,
    },
    diffculty: {
        height: 30 / 720,
        stroke: 1 / 720,
    },
};

export class Overlay {
    async init(game) {
        this.score = new Score();
        await this.score.init(game);
        this.combo = new Combo();
        await this.combo.init(game);
        this.roll = new Roll();
        await this.roll.init(game);

        this.game = game;
        this.base = document.getElementById('game-overlay');
        this.title = document.getElementById('game-title');
        this.diffcultyImg = document.getElementById('game-diffculty-img');
        this.gaugeTop = document.getElementById('game-gauge-top');
        
        this.updateLayout();
        this.updateTitle();
        await this.loadDiffculty();
        await this.loadGaugeTop();
    }

    updateLayout() {
        let height = this.game.plotter.gl.canvas.height;

        // title
        this.title.style.fontSize = height * Layout.title.height + 'px';
        this.title.style.webkitTextStrokeWidth = height * Layout.title.stroke + 'px';

        this.score.updateLayout(height);
        this.combo.updateLayout(height);
        this.roll.updateLayout(height);
    }

    updateTitle() {
        this.title.textContent = this.game.referee.music.metaData.title;
    }

    async loadDiffculty() {
        return new Promise((resolve, reject) => {
            this.diffcultyImg.onload = () => {
                return resolve();
            };
            switch (this.game.referee.music.type) {
                case CourseType.EASY:
                    this.diffcultyImg.src = '/assets/img/easy.png';
                    break;
                case CourseType.NORMAL:
                    this.diffcultyImg.src = '/assets/img/normal.png';
                    break;
                case CourseType.HARD:
                    this.diffcultyImg.src = '/assets/img/hard.png';
                    break;
                case CourseType.EXTREME:
                    this.diffcultyImg.src = '/assets/img/extreme.png';
                    break;
                case CourseType.EXTRA:
                    this.diffcultyImg.src = '/assets/img/extra.png';
                    break;
            }
        });
    }

    async loadGaugeTop() {
        return new Promise((resolve, reject) => {
            this.gaugeTop.onload = () => {
                return resolve();
            };

            let diffculty = this.game.songInfo.type;
            if (diffculty == CourseType.HARD ||
                diffculty == CourseType.EXTREME ||
                diffculty == CourseType.EXTRA) {
                this.gaugeTop.src = '/assets/img/gauge-hard-top.png';
            } else {
                this.gaugeTop.src = '/assets/img/gauge-easy-top.png';
            }
        });
    }


    updateShake(delta) {
        this.score.updateShake(delta);
    }

}