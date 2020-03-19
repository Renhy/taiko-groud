import { createProgramFromUrl, loadTextureFromUrl } from './gl-utils.js';
import { BeatType } from './constant.js';

var Layout = {
    line: {
        height: 267 / 720,
        left: 412 / 1280,
        length: 868 / 1280,
    },
    width: 71 / 1280,
    height: 71 / 720,
    daiWidth: 109 / 1280,
    daiHeight: 109 / 720,
};

export class Note {
    async init(sticker) {
        this.sticker = sticker;

        await this.sticker.loadTexture('do', '/assets/img/do.png');
        await this.sticker.loadTexture('ka', '/assets/img/ka.png');
    }

    render(state) {
        for (let i = state.nextBeats.length - 1; i >= 0; i--) {
            let beat = state.nextBeats[i];

            let dstX = Layout.line.left;
            dstX += beat.distance * Layout.line.length;
            dstX -= Layout.width * 0.5;

            let dstY = Layout.line.height;
            dstY -= Layout.height * 0.5;

            if (beat.type == BeatType.DO) {
                this.sticker.stick(
                    'do', 
                    dstX, dstY, 
                    Layout.width, Layout.height);
                continue;
            }
            if (beat.type == BeatType.KA) {
                this.sticker.stick(
                    'ka', 
                    dstX, dstY, 
                    Layout.width, Layout.height);
                continue;
            }
            if (beat.type == BeatType.DAI_DO) {
                this.sticker.stick('do', 
                    dstX, dstY,
                    Layout.daiWidth, Layout.daiHeight);
                continue;
            }
            if (beat.type == BeatType.DAI_KA) {
                this.sticker.stick('ka', 
                    dstX, dstY,
                    Layout.daiWidth, Layout.daiHeight);
                continue;
            }
        }
    }
        
    
}


