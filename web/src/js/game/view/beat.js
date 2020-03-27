
var Layout = {
    last: 150,
    left: 512 / 1280,
    top: 470 / 720,
    width: 256 / 1280,
    height: 256 / 720,
};

export class Beat {
    async init(game) {
        this.game = game;
        this.sticker = game.plotter.sticker;
        this.referee = game.referee;

        await this.sticker.loadTexture('leftDo', '/assets/img/left-do.png');
        await this.sticker.loadTexture('rightDo', '/assets/img/right-do.png');
        await this.sticker.loadTexture('leftKa', '/assets/img/left-ka.png');
        await this.sticker.loadTexture('rightKa', '/assets/img/right-ka.png');
    }

    render(delta) {
        if (delta - this.referee.state.play.leftDo < Layout.last) {
            this.sticker.stick('leftDo', 
            Layout.left, Layout.top, Layout.width, Layout.height);
        }
        if (delta - this.referee.state.play.rightDo < Layout.last) {
            this.sticker.stick('rightDo', 
            Layout.left, Layout.top, Layout.width, Layout.height);
        }
        if (delta - this.referee.state.play.leftKa < Layout.last) {
            this.sticker.stick('leftKa', 
            Layout.left, Layout.top, Layout.width, Layout.height);
        }
        if (delta - this.referee.state.play.rightKa < Layout.last) {
            this.sticker.stick('rightKa', 
            Layout.left, Layout.top, Layout.width, Layout.height);
        }
        

    }
}

