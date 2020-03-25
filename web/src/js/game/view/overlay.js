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
        this.diffcultyText = document.getElementById('game-diffculty-text');

        this.updateLayout();

        this.updateTitle();
        await this.updateDiffculty();
    }

    updateLayout() {
        let height = this.game.plotter.gl.canvas.height;

        // title
        this.title.style.fontSize = height * Layout.title.height + 'px';
        this.title.style.webkitTextStrokeWidth = height * Layout.title.stroke + 'px';

        // score
        this.score.style.fontSize = height * Layout.score.height + 'px';
        this.score.style.webkitTextStrokeWidth = height * Layout.score.stroke + 'px';

        // diffculty
        this.diffcultyText.style.fontSize = height * Layout.diffculty.height + 'px';
        this.diffcultyText.style.webkitTextStrokeWidth = height * Layout.diffculty.stroke + 'px';

    }

    updateTitle() {
        this.title.textContent = this.game.referee.music.metaData.title;
    }

    async updateDiffculty() {
        this.diffcultyImg.onload = () => {
            return resolve();
        };

        switch (this.game.referee.music.type) {
            case CourseType.EASY:
                this.diffcultyImg.src = Assets.img.easy;
                this.diffcultyText.textContent = '简单';
                break;
            case CourseType.NORMAL:
                this.diffcultyImg.src = Assets.img.normal;
                this.diffcultyText.textContent = '普通';
                break;
            case CourseType.HARD:
                this.diffcultyImg.src = Assets.img.hard;
                this.diffcultyText.textContent = '困难';
                break;
            case CourseType.EXTREME:
                this.diffcultyImg.src = Assets.img.extreme;
                this.diffcultyText.textContent = '魔王';
                break;
            case CourseType.EXTRA:
                this.diffcultyImg.src = Assets.img.extra;
                this.diffcultyText.textContent = '魔王';
                break;
        }
    }



}