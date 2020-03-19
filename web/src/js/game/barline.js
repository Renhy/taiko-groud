

var Layout = {

};

export class Barline {
    async init(sticker) {
        this.sticker = sticker;

        await this.sticker.loadTexture('barline', '/assets/img/barline.png');
    }

    render(state) {
        let distance = state.barline;

    }

}

