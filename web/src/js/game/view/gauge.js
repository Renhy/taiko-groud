
var Layout = {
    zero: 548 / 1280,
    step: 12 / 1280,

    left: {
        top: 155 / 720,
        height: (184 - 155) / 720,
    },
    right: {
        top: 143 / 720,
        height: (184 - 143) / 720,
    },
};


export class Gauge {
    async init(game) {
        this.game = game;
        this.sticker = game.plotter.sticker;
        this.scorekeeper = game.referee.scorekeeper;

        await this.sticker.loadTexture('fill1', '/assets/img/gauge-fill-1.png');
        await this.sticker.loadTexture('fill2', '/assets/img/gauge-fill-2.png');
        await this.sticker.loadTexture('fill3', '/assets/img/gauge-fill-3.png');
    }

    render(delta) {
        let threshold = this.scorekeeper.gauge.threshold;
        let value = this.scorekeeper.gauge.light;
        if (value <= threshold) {
            this.sticker.stick(
                'fill1', 
                Layout.zero, 
                Layout.left.top, 
                value * Layout.step, 
                Layout.left.height);
            return;
        }
        if (value < 50) {
            this.sticker.stick(
                'fill2', 
                Layout.zero, 
                Layout.left.top, 
                threshold * Layout.step, 
                Layout.left.height);
            this.sticker.stick(
                'fill3', 
                Layout.zero + threshold * Layout.step, 
                Layout.right.top, 
                (value - threshold) * Layout.step, 
                Layout.right.height);
            return;
        }

    }

}