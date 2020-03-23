

export class Judge {
    async init(sticker, referee) {
        this.sticker = sticker;
        this.referee = referee;

        await this.sticker.loadTexture('good', '/assets/img/good.png');
        await this.sticker.loadTexture('ok', '/assets/img/ok.png');
        await this.sticker.loadTexture('bad', '/assets/img/bad.png');
    }

    render(delta) {

    }

}