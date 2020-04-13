import { BeatType } from '../constant.js';

var Layout = {
    line: {
        height: 267 / 720,
        textHeight: 318 / 720,
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
    text: {
        width: 50 / 1280,
        height: 25 / 720,
    },
    note: {
        width: 70 / 1280,
        height: 70 / 720,
    },
    daiNote: {
        width: 110 / 1280,
        height: 110 / 720,
    },
    balloon: {
        deltaX: 10 / 868,
        width: 120 / 1280,
        height: 100 / 720,

        xiaogu: {
            left: 300 / 1280,
            top: 185 / 720,
            width: 160 / 1280,
            height: 160 / 720,
        },
        bubble: {
            left: 415 / 1280,
            top: 208 / 720,
            width: 140 / 1280,
            height: 140 / 720,
        },
    },
    record: {
        last: 500,
        start: {
            x: 412 / 1280,
            y: 267 / 720,
        },
        end: {
            x: 1187.5 / 1280,
            y: 146 / 720,
        },
        top: {
            x: 800 / 1280,
            y: -20 / 720,
        },
    },
};

export class Note {

    async init(game) {
        this.game = game;
        this.sticker = game.plotter.sticker;
        this.referee = game.referee;
        this.music = game.referee.music;

        // y = ax^2 + bx + c
        let x1 = Layout.record.start.x;
        let y1 = Layout.record.start.y;

        let x2 = Layout.record.end.x;
        let y2 = Layout.record.end.y;

        let x3 = Layout.record.top.x;
        let y3 = Layout.record.top.y;

        let b = (y1 - y3 - ((x1 * x1 - x3 * x3) * (y1 - y2) / (x1 * x1 - x2 * x2))) /
            (x1 - x3 + (x1 * x1 - x3 * x3) * (x2 - x1) / (x1 * x1 - x2 * x2));
        let a = (y1 - y2 + (x2 - x1) * b) / (x1 * x1 - x2 * x2);
        let c = y1 - a * x1 * x1 - b * x1;
        this.curveParams = {
            a: a,
            b: b,
            c: c,
        };

        await this.sticker.loadTexture('do', '/assets/img/do.png');
        await this.sticker.loadTexture('ka', '/assets/img/ka.png');
        await this.sticker.loadTexture('barline', '/assets/img/barline.png');
        await this.sticker.loadTexture('drumrollLeft', '/assets/img/drumroll-left.png');
        await this.sticker.loadTexture('drumrollRight', '/assets/img/drumroll-right.png');
        await this.sticker.loadTexture('drumrollFill', '/assets/img/drumroll-fill.png');
        await this.sticker.loadTexture('balloon', '/assets/img/balloon.png');
        await this.sticker.loadTexture('xiaogu', '/assets/img/xiaogu.png');
        await this.sticker.loadTexture('balloonBubble', '/assets/img/balloon-bubble.png');
        await this.sticker.loadTexture('text-do', '/assets/img/note-text-do.png');
        await this.sticker.loadTexture('text-ka', '/assets/img/note-text-ka.png');
        await this.sticker.loadTexture('text-daiDo', '/assets/img/note-text-daiDo.png');
        await this.sticker.loadTexture('text-daiKa', '/assets/img/note-text-daiKa.png');
        await this.sticker.loadTexture('text-roll', '/assets/img/note-text-roll.png');
        await this.sticker.loadTexture('text-balloon', '/assets/img/note-text-balloon.png');
    }

    render(delta) {
        this.renderBarline(delta);
        this.renderBeats(delta);
        this.renderRecord(delta);
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
                        if (this.music.beats[j].type == BeatType.BALLOON) {
                            beat.type = BeatType.BALLOON;
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
                    this.text('text-do', beat.distance);
                    break;
                case BeatType.KA:
                    this.note('ka', beat.distance);
                    this.text('text-ka', beat.distance);
                    break;
                case BeatType.DAI_DO:
                    this.daiNote('do', beat.distance);
                    this.text('text-daiDo', beat.distance);
                    break;
                case BeatType.DAI_KA:
                    this.daiNote('ka', beat.distance);
                    this.text('text-daiKa', beat.distance);
                    break;
                case BeatType.DRUMROLL:
                    this.drumroll(beat.distance, beat.end);
                    this.text('text-roll', beat.distance);
                    break;
                case BeatType.DAI_DRUMROLL:
                    this.daiDrumroll(beat.distance, beat.end);
                    this.text('text-roll', beat.distance);
                    break;
                case BeatType.BALLOON:
                    this.balloon(beat.distance);
                    this.text('text-balloon', beat.distance);
                    break;
            }
        }

        if (this.referee.state.play.balloon) {
            if (this.referee.state.play.hitCount == 0) {
                this.balloon(0);
            } else {
                this.sticker.stick('xiaogu', 
                    Layout.balloon.xiaogu.left, Layout.balloon.xiaogu.top,
                    Layout.balloon.xiaogu.width, Layout.balloon.xiaogu.height);
                this.sticker.stick('balloonBubble', 
                    Layout.balloon.bubble.left, Layout.balloon.bubble.top,
                    Layout.balloon.bubble.width, Layout.balloon.bubble.height);
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

    balloon(distance) {
        let x = Layout.line.zero;
        x += (distance + Layout.balloon.deltaX) * Layout.line.length;

        let y = Layout.line.height - Layout.balloon.height * 0.5;

        this.sticker.stick('balloon', 
            x, y,
            Layout.balloon.width, 
            Layout.balloon.height);

        this.note('do',distance);
    }

    text(tag, distance) {
        if (distance > Layout.line.right || distance < Layout.line.left) {
            return;
        }

        let x = Layout.line.zero;
        x += distance * Layout.line.length;
        x -= Layout.text.width * 0.5;

        this.sticker.stick(
            tag, 
            x, Layout.line.textHeight, 
            Layout.text.width, Layout.text.height);
    }

    renderRecord(delta) {
        for (let i = this.referee.records.length - 1; i >= 0; i--) {
            let record = this.referee.records[i];
            if (delta - record.ts > Layout.record.last) {
                break;
            }

            let tag = 'do';
            if (record.value == BeatType.KA) {
                tag = 'ka';
            }

            let x = (Layout.record.end.x - Layout.record.start.x) * 
                (delta - record.ts) / Layout.record.last;
            x += Layout.record.start.x;
            let y = this.curveParams.a * x * x + this.curveParams.b * x + this.curveParams.c;

            let w = Layout.note.width;
            let h = Layout.note.height;
            if (record.daiNote) {
                w = Layout.daiNote.width;
                h = Layout.daiNote.height;
            } 

            this.sticker.stick(tag, 
                x - w * 0.5, y - h * 0.5, 
                w, h);
        }
    }

}


