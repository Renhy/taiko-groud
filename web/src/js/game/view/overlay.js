
var Layout = {
    title: {
        height: 60 / 720,
        stroke: 4 / 720,
    },
    score: {
        height: 55 / 720,
        stroke: 6 / 720,
    },

};

export class Overlay {
    async init(game) {
        this.game = game;
        this.base = document.getElementById('game-overlay');
        this.title = document.getElementById('game-title');
        this.score = document.getElementById('game-score');

        this.updateLayout();
        this.updateTitle();
    }

    updateLayout() {
        let height = this.game.plotter.gl.canvas.height;

        // title
        this.title.style.fontSize = height * Layout.title.height + 'px';
        this.title.style.webkitTextStrokeWidth = height * Layout.title.stroke + 'px';

        //score
        this.score.style.fontSize = height * Layout.score.height + 'px';
        this.score.style.webkitTextStrokeWidth = height * Layout.score.stroke + 'px';


    }

    updateTitle() {
        this.title.textContent = this.game.referee.music.metaData.title;

    }




}