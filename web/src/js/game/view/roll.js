
var Layout = {
    height: 60 / 720,
    stroke: 3 / 720,
};

export class Roll {
    async init(game) {
        this.game = game;

        this.rollDiv = document.getElementById('game-roll');
        this.rollCount = document.getElementById('game-roll-count');
        this.rollBack = document.getElementById('game-roll-back');

        await new Promise((resolve, reject) => {
            this.rollBack.onload = () => {
                return resolve();
            };

            this.rollBack.src = '/assets/img/balloon-count-back.png';
        });
    }


    updateLayout(height) {
        this.rollCount.style.fontSize = 
            height * Layout.height + 'px';
        this.rollCount.style.webkitTextStrokeWidth = 
            height * Layout.stroke + 'px';
    }

    update() {
        let count = this.game.referee.state.play.hitCount;
        if (count <= 0) {
            return;
        }

        console.log(count);
        if (this.rollDiv.style.visibility != 'visible') {
            this.rollDiv.style.visibility = 'visible';
        }

        if (this.game.referee.state.play.drumroll ||
            this.game.referee.state.play.daiDrumroll) {
            this.rollCount.innerHTML = count;
            return;
        }
        if (this.game.referee.state.play.balloon) {
            let total = this.game.referee.music.balloonCounts[this.game.referee.index.balloon];
            this.rollCount.innerHTML = total - count;
            return;
        }
    }

    close(delay) {
        this.rollDiv.style.visibility = 'hidden';
    }

}

