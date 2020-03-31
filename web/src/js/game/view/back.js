import { CourseType } from "../constant.js";

export class Back {
    async init(game) {
        this.game = game;

        this.background = document.getElementById('game-background');
        this.gaugebuttom = document.getElementById('game-gauge-bottom');

        await new Promise((resolve, reject) => {
            this.background.onload = () => {
                return resolve();
            };

            this.background.src = '/assets/img/game-base.png';
        });

        await new Promise((resolve, reject) => {
            this.gaugebuttom.onload = () => {
                return resolve();
            };

            let diffculty = this.game.songInfo.type;
            if (diffculty == CourseType.HARD ||
                diffculty == CourseType.EXTREME ||
                diffculty == CourseType.EXTREME) {
                this.gaugebuttom.src = '/assets/img/gauge-hard-bottom.png';
            } else {
                this.gaugebuttom.src = '/assets/img/gauge-easy-bottom.png';
            }
        });

    }
}
