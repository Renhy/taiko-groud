import { BeatType } from './constant.js';

var Layout = {
    line: {
        height: 267 / 720,
        left: 412 / 1280,
        length: 868 / 1280,
    },
    barline: {
        top: 193 / 720,
        width: 256 / 1280,
        height: 161 / 720,
    },
    note: {
        width: 70 / 1280,
        height: 70 / 720,
    },
    daiNote: {
        width: 110 / 1280,
        height: 110 / 720,
    },
};

export class Note {
    async init(sticker) {
        this.sticker = sticker;

        await this.sticker.loadTexture('do', '/assets/img/do.png');
        await this.sticker.loadTexture('ka', '/assets/img/ka.png');
        await this.sticker.loadTexture('barline', '/assets/img/barline.png');
    }

    render(state) {
        this.renderBarline(state.barline);
        this.renderBeats(state.nextBeats);
    }

    renderBarline(distance) {
        let x = Layout.line.left;
        x += distance * Layout.line.length;
        x -= Layout.barline.width * 0.5;

        let y = Layout.barline.top;
        
        this.sticker.stick('barline', 
            x, y, 
            Layout.barline.width, Layout.barline.height);
    }
    
    renderBeats(beats) {
        for (let i = beats.length - 1; i >= 0; i--) {
            let beat = beats[i];
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
        }
    }

    note(tag, distance) {
        let x =  Layout.line.left;
        x += distance * Layout.line.length;
        x -= Layout.note.width * 0.5;

        let y = Layout.line.height;
        y -= Layout.note.height * 0.5;

        this.sticker.stick(
            tag,
            x, y,
            Layout.note.width, Layout.note.height);
    }

    daiNote(tag, distance) {
        let x =  Layout.line.left;
        x += distance * Layout.line.length;
        x -= Layout.daiNote.width * 0.5;

        let y = Layout.line.height;
        y -= Layout.daiNote.height * 0.5;

        this.sticker.stick(
            tag,
            x, y,
            Layout.daiNote.width, Layout.daiNote.height);
    }


    
}


