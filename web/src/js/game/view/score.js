var Layout = {
    total: {
        height: 55 / 720,
        stroke: 6 / 720,
    },
    add: {
        height: 30 / 720,
        stroke: 3 / 720,
        last: 300,
        right: 75,
        shake: {
            t: 30,
            d: 15 / 1280,
        },
    },
};

export class Score {
    async init(game) {
        this.game = game;

        this.add = document.getElementById('game-score-add');
        this.total = document.getElementById('game-score');
    }

    updateLayout(height) {
        this.total.style.fontSize = height * Layout.total.height + 'px';
        this.total.style.webkitTextStrokeWidth = height * Layout.total.stroke + 'px';

        this.add.style.fontSize = height * Layout.add.height + 'px';
        this.add.style.webkitTextStrokeWidth = height * Layout.add.stroke + 'px';
        this.add.style.right = Layout.add.right + '%';
    }

    updateShake(delta) {
        let ts = this.game.referee.scorekeeper.addTime;
        ts = delta - ts;
        if (ts > Layout.add.last || ts < 0) {
            this.add.style.visibility = 'hidden';
        } else {
            this.add.style.visibility = 'visible';
            this.add.style.right = this.calculateShake(ts) + '%';
        }
    }

    calculateShake(time) {
        let shake = Layout.add.right;
        if (time > Layout.add.shake.t * 2) {
            return shake;
        }

        let t = Layout.add.shake.t;
        let d = Layout.add.shake.d;
        return shake +
            ((d / t / t) * (time * time) - (2 * d / t) * time + d) * 100;
    }

}