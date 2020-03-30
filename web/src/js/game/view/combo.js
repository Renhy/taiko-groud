
var Layout = {
    height: 120 / 720,
    stroke: 6 / 720,
};

export class Combo {
    async init(game) {
        this.game = game;

        this.comboDiv = document.getElementById('game-combo');
        this.comboCount = document.getElementById('game-combo-count');
        this.comboText = document.getElementById('game-combo-text');

    }

    updateLayout(height) {
        this.comboCount.style.fontSize = 
            height * Layout.height + 'px';
        this.comboCount.style.webkitTextStrokeWidth = 
            height * Layout.stroke + 'px';

        this.comboText.style.fontSize = 
            height * Layout.height * 0.4 + 'px';
        this.comboText.style.webkitTextStrokeWidth = 
            height * Layout.stroke * 0.5 + 'px';
        this.comboText.innerHTML = '连段';
    }

    update() {
        let combo = this.game.referee.state.play.combo;

        this.comboCount.innerHTML = combo;
        if (combo >= 10 &&
            this.comboDiv.style.visibility != 'visible') {
            this.comboDiv.style.visibility = 'visible';
        }
        if (combo >= 100 &&
            this.comboCount.style.color != '#da7616') {
            this.comboCount.style.color = '#da7616';
        }
    }

    break() {
        this.comboDiv.style.visibility = 'hidden';
        this.comboCount.style.color = 'white';
    }

}