
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
    rainbow: {
        length: 0.5,
        move: 0.05,
    },
    hun: {
        left: 1146 / 1280,
        top: 105 / 720,
        width: (1229 - 1146) / 1280,
        height: (187 - 105) / 720,
    },
};


export class Gauge {
    async init(game) {
        this.game = game;
        this.sticker = game.plotter.sticker;
        this.scorekeeper = game.referee.scorekeeper;
        this.rainbowOffset = 0;

        await this.sticker.loadTexture('fill1', '/assets/img/gauge-fill-1.png');
        await this.sticker.loadTexture('fill2', '/assets/img/gauge-fill-2.png');
        await this.sticker.loadTexture('fill3', '/assets/img/gauge-fill-3.png');
        await this.sticker.loadTexture('rainbow', '/assets/img/rainbow.png');
        await this.sticker.loadTexture('hun', 'assets/img/hun.png');
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


        this.sticker.stick(
            'hun', 
            Layout.hun.left, Layout.hun.top,
            Layout.hun.width, Layout.hun.height);

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


        let mid = threshold / 50;
        this.sticker.stick(
            'rainbow',
            Layout.zero,
            Layout.left.top,
            threshold * Layout.step,
            Layout.left.height,
            this.rainbowOffset, 0,
            Layout.rainbow.length * mid, 1);
        this.sticker.stick(
            'rainbow',
            Layout.zero + threshold * Layout.step,
            Layout.right.top,
            (value - threshold) * Layout.step,
            Layout.right.height,
            this.rainbowOffset + Layout.rainbow.length * mid, 0,
            Layout.rainbow.length * (1 - mid), 1);

        this.rainbowOffset -= Layout.rainbow.move;
        if (this.rainbowOffset < 0) {
            this.rainbowOffset += 1;
        }
    }

}