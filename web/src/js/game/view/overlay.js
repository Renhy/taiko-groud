import { CourseType } from "../constant.js";
import { Assets } from "../../assets.js";

var Layout = {
    title: {
        height: 60 / 720,
        stroke: 4 / 720,
    },
    score: {
        height: 55 / 720,
        stroke: 6 / 720,
    },
    diffculty: {
        height: 30 / 720,
        stroke: 1 / 720,
    }
};

export class Overlay {
    async init(game) {
        this.game = game;
        this.base = document.getElementById('game-overlay');
        this.title = document.getElementById('game-title');
        this.score = document.getElementById('game-score');
        this.diffcultyImg = document.getElementById('game-diffculty-img');
        this.completenessImg = document.getElementById('game-completeness-img');

        this.updateLayout();

        this.updateTitle();
        await this.updateDiffculty();
        await this.updateCompleteness();
    }

    updateLayout() {
        let height = this.game.plotter.gl.canvas.height;

        // title
        this.title.style.fontSize = height * Layout.title.height + 'px';
        this.title.style.webkitTextStrokeWidth = height * Layout.title.stroke + 'px';

        // score
        this.score.style.fontSize = height * Layout.score.height + 'px';
        this.score.style.webkitTextStrokeWidth = height * Layout.score.stroke + 'px';

    }

    updateTitle() {
        this.title.textContent = this.game.referee.music.metaData.title;
    }

    async updateDiffculty() {
        return new Promise((resolve, reject) => {
            this.diffcultyImg.onload = () => {
                return resolve();
            };
            switch (this.game.referee.music.type) {
                case CourseType.EASY:
                    this.diffcultyImg.src = Assets.img.easy;
                    break;
                case CourseType.NORMAL:
                    this.diffcultyImg.src = Assets.img.normal;
                    break;
                case CourseType.HARD:
                    this.diffcultyImg.src = Assets.img.hard;
                    break;
                case CourseType.EXTREME:
                    this.diffcultyImg.src = Assets.img.extreme;
                    break;
                case CourseType.EXTRA:
                    this.diffcultyImg.src = Assets.img.extra;
                    break;
            }
        });
    }

    async updateCompleteness() {
        return new Promise((resolve, reject) => {
            this.completenessImg.onload = () => {
                return resolve();
            };

            this.completenessImg.src = Assets.img.completeness;
        });
    }



}