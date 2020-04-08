
var Layout = {
    beat: {
        left: (412 - 64) / 1280,
        top: (267 - 64) / 720,
        width: 128 / 1280,
        height: 128 / 720,
    },
    drum: {
        last: 150,
        left: 512 / 1280,
        top: 470 / 720,
        width: 256 / 1280,
        height: 256 / 720,
    }
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
        await this.sticker.loadTexture('beat-start', '/assets/img/beat-point-start.png');
        await this.sticker.loadTexture('beat-ggt', '/assets/img/beat-point-ggt.png');
    }

    render(delta) {
        if (this.game.referee.state.play.gogoTime) {
            this.sticker.stick('beat-ggt', 
            Layout.beat.left, Layout.beat.top, Layout.beat.width, Layout.beat.height);
        } else {
            this.sticker.stick('beat-start', 
            Layout.beat.left, Layout.beat.top, Layout.beat.width, Layout.beat.height);
        }

        if (delta - this.referee.state.play.leftDo < Layout.drum.last) {
            this.sticker.stick('leftDo', 
            Layout.drum.left, Layout.drum.top, Layout.drum.width, Layout.drum.height);
        }
        if (delta - this.referee.state.play.rightDo < Layout.drum.last) {
            this.sticker.stick('rightDo', 
            Layout.drum.left, Layout.drum.top, Layout.drum.width, Layout.drum.height);
        }
        if (delta - this.referee.state.play.leftKa < Layout.drum.last) {
            this.sticker.stick('leftKa', 
            Layout.drum.left, Layout.drum.top, Layout.drum.width, Layout.drum.height);
        }
        if (delta - this.referee.state.play.rightKa < Layout.drum.last) {
            this.sticker.stick('rightKa', 
            Layout.drum.left, Layout.drum.top, Layout.drum.width, Layout.drum.height);
        }
        

    }
}

