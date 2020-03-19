import { BeatType } from './constant.js';

var Layout = {
    line: {
        height: 267 / 720,
        left: 412 / 1280,
        length: 868 / 1280,
    },
    width: 70 / 1280,
    height: 70 / 720,
    daiWidth: 110 / 1280,
    daiHeight: 110 / 720,
};

export class Note {
    async init(sticker) {
        this.sticker = sticker;

        await this.sticker.loadTexture('do', '/assets/img/do.png');
        await this.sticker.loadTexture('ka', '/assets/img/ka.png');
        await this.sticker.loadTexture('barline', '/assets/img/barline.png');
    }

    render(state) {
        for (let i = state.nextBeats.length - 1; i >= 0; i--) {
            let beat = state.nextBeats[i];
            switch (beat.type) {
                case BeatType.DO:
                    this.note('do', beat.distance);
                    break;
                case BeatType.KA:
                    this.note('ka', beat.distance);
                    break;
                case BeatType.DAI_DO:
                    this.daiNote('do', beat.distance);
                    break;
                case BeatType.DAI_KA:
                    this.daiNote('ka', beat.distance);
                    break;
            }

            let dstX = Layout.line.left;
            dstX += beat.distance * Layout.line.length;
            dstX -= Layout.width * 0.5;

            let dstY = Layout.line.height;
            dstY -= Layout.height * 0.5;
        }
    }
        
    note(tag, distance) {
        let x =  Layout.line.left;
        x += distance * Layout.line.length;
        x -= Layout.width * 0.5;

        let y = Layout.line.height;
        y -= Layout.height * 0.5;

        this.sticker.stick(
            tag,
            x, y,
            Layout.width, Layout.height);
    }

    daiNote(tag, distance) {
        let x =  Layout.line.left;
        x += distance * Layout.line.length;
        x -= Layout.daiWidth * 0.5;

        let y = Layout.line.height;
        y -= Layout.daiHeight * 0.5;

        this.sticker.stick(
            tag,
            x, y,
            Layout.daiWidth, Layout.daiHeight);
    }


    
}


