import { BeatType } from '../constant.js';

var Layout = {
    line: {
        height: 267 / 720,
        zero: 412 / 1280,
        length: 868 / 1280,
        left: (332 - 412) / 868,
        right: 1,
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

    async init(sticker, referee) {
        this.sticker = sticker;
        this.referee = referee;
        this.music = referee.music;

        await this.sticker.loadTexture('do', '/assets/img/do.png');
        await this.sticker.loadTexture('ka', '/assets/img/ka.png');
        await this.sticker.loadTexture('barline', '/assets/img/barline.png');
        await this.sticker.loadTexture('drumrollLeft', '/assets/img/drumroll-left.png');
        await this.sticker.loadTexture('drumrollRight', '/assets/img/drumroll-right.png');
        await this.sticker.loadTexture('drumrollFill', '/assets/img/drumroll-fill.png');
        await this.sticker.loadTexture('balloon', '/assets/img/balloon.png');
        await this.sticker.loadTexture('xiaogu', '/assets/img/xiaogu.png');
        await this.sticker.loadTexture('balloonBubble', '/assets/img/balloon-bubble.png');
    }

    render(delta) {
        this.renderBarline(delta);
        this.renderBeats(delta);
    }

    renderBarline(delta) {
        if (this.referee.index.measure + 1 >= this.music.measures.length) {
            return;
        }

        let currentMeasure = this.music.measures[this.referee.index.measure];
        let nextMeasure = this.music.measures[this.referee.index.measure + 1];

        let distance = (nextMeasure.start - delta) / currentMeasure.duration;
        if (distance > 1) {
            distance -= 1;
        }

        let x = Layout.line.zero;
        x += distance * Layout.line.length;
        x -= Layout.barline.width * 0.5;

        let y = Layout.barline.top;
        
        this.sticker.stick('barline', 
            x, y, 
            Layout.barline.width, Layout.barline.height);
    }
    
    renderBeats(delta) {
        let stopTs = delta + this.music.measures[this.referee.index.measure].duration;
        let distancePerTime = 1 / this.music.measures[this.referee.index.measure].duration;

        let beats = [];
        for (let i = this.referee.index.beat; i < this.music.beats.length; i++) {
            let beat = {
                distance: (this.music.beats[i].ts - delta) * distancePerTime,
                type: this.music.beats[i].type,
            }

            if (beat.type == BeatType.DRUMROLL ||
                beat.type == BeatType.DAI_DRUMROLL) {
                for (let j= i; j < this.music.beats.length; j++) {
                    if (this.music.beats[j].type == BeatType.END) {
                        beat.end = (this.music.beats[j].ts - delta) * distancePerTime;
                        break;
                    }
                }
            }
            if (beat.type == BeatType.END) {
                if (beats.length == 0) {
                    for (let j = i; j >= 0; j--) {
                        if (this.music.beats[j].type == BeatType.DRUMROLL ||
                            this.music.beats[j].type == BeatType.DAI_DRUMROLL) {
                            if (beats.length > 0) {
                                beats[beats.length - 1].end = beat.ts;
                            } else {
                                beat.type = this.music.beats[j].type;
                                beat.end = beat.distance;
                                beat.distance = (this.music.beats[j].ts - delta) * distancePerTime;
                            }
                            break;
                        }
                    }
                }
            }

            beats.push(beat);
            if (this.music.beats[i].ts > stopTs) {
                break;
            }
        }

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
                case BeatType.DRUMROLL:
                    this.drumroll(beat.distance, beat.end);
                    break;
                case BeatType.DAI_DRUMROLL:
                    this.daiDrumroll(beat.distance, beat.end);
                    break;
            }
        }
    }

    note(tag, distance) {
        if (distance > Layout.line.right || distance < Layout.line.left) {
            return;
        }
        let x =  Layout.line.zero;
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
        if (distance > Layout.line.right || distance < Layout.line.left) {
            return;
        }
        let x =  Layout.line.zero;
        x += distance * Layout.line.length;
        x -= Layout.daiNote.width * 0.5;

        let y = Layout.line.height;
        y -= Layout.daiNote.height * 0.5;

        this.sticker.stick(
            tag,
            x, y,
            Layout.daiNote.width, Layout.daiNote.height);
    }

    drumroll(left, right) {
        if (right < Layout.line.right) {
            this.note('drumrollRight', right); 
        } else {
            right = Layout.line.right;
        }
        
        if (left > Layout.line.left) {
            this.fillDrumroll(left, right, Layout.note.height);
            this.note('drumrollLeft', left);
        } else {
            this.fillDrumroll(Layout.line.left, right, Layout.note.height);
        }
    }

    daiDrumroll(left, right) {
        if (right < Layout.line.right) {
            this.daiNote('drumrollRight', right);
        } else {
            right = Layout.line.right;
        }

        if (left > Layout.line.left) {
            this.fillDrumroll(left, right, Layout.daiNote.height);
            this.daiNote('drumrollLeft', left);
        } else {
            this.fillDrumroll(Layout.line.left, right, Layout.daiNote.height);
        }
    }

    fillDrumroll(left, right, height) {
        let x = Layout.line.zero + left * Layout.line.length;
        let y = Layout.line.height - height * 0.5;

        let width = (right - left) * Layout.line.length;

        this.sticker.stick(
            'drumrollFill',
            x, y,
            width, height);

    }

    
}


