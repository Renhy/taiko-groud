

export class Judge {
    async init(sticker) {
        this.sticker = sticker;

        await this.sticker.loadTexture('good', '/assets/img/good.png');
        await this.sticker.loadTexture('ok', '/assets/img/ok.png');
        await this.sticker.loadTexture('bad', '/assets/img/bad.png');
    }

    render(state) {

    }

}