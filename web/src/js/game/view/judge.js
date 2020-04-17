import { JudgeResult } from "../constant.js";


var Layout = {
    base: {
        x: 380 / 1280,
        y: 165 / 720,
        width: 64 / 1280,
        height: 64 / 720,
    },
    last: 200,
    shake: {
        t: 30,
        d: 10 / 720,
    },
    explosion: {
        center:{
            x: 412 / 1280,
            y: 267 / 720,
        },
        base: {
            width: 70 / 1280,
            height: 70 / 720,
        },
        magnify: 2,
    },
};

export class Judge {
    async init(game) {
        this.game = game;
        this.sticker = game.plotter.sticker;
        this.referee = game.referee;

        await this.sticker.loadTexture('good', '/assets/img/good.png');
        await this.sticker.loadTexture('ok', '/assets/img/ok.png');
        await this.sticker.loadTexture('bad', '/assets/img/bad.png');
        await this.sticker.loadTexture('good-explosion', '/assets/img/beat-explosion-good.png');
        await this.sticker.loadTexture('ok-explosion', '/assets/img/beat-explosion-ok.png');
    }

    render(delta) {
        if (this.referee.state.judge.result == JudgeResult.NONE) {
            return;
        }

        let time = delta - this.referee.state.judge.ts;
        if (time > Layout.last || time < 0) {
            return;
        }

        let shake = this.calculateShake(time);
        let tag = 'good';
        switch(this.referee.state.judge.result) {
            case JudgeResult.GOOD:
                tag = 'good';
                this.explosion('good-explosion', time);
                break;
            case JudgeResult.OK:
                tag = 'ok';
                this.explosion('ok-explosion', time);
                break;
            case JudgeResult.BAD:
                tag = 'bad';
                break;
        }

        this.sticker.stick(tag, 
            Layout.base.x, Layout.base.y - shake,
            Layout.base.width, Layout.base.height);
    }

    calculateShake(time) {
        // time>t, then 0
        // time<=t, then (-d/t^2) * t^2 + (2d/t) * t - d

        if (time > Layout.shake.t) {
            return 0;
        }

        let t = Layout.shake.t;
        let d = Layout.shake.d;
        return (-1 * d / t / t) * (time * time) + (2 * d / t) * time - d;
    }

    explosion(tag, time) {
        if (time > Layout.last / 2) {
            return;
        }

        let a = time * 2;

        // a = -0.25 * a^2 + a
        a = a * 2 / Layout.last;
        a = a - 0.25 * a * a;

        a *= Layout.explosion.magnify - 1;
        a += 1;

        let w = a * Layout.explosion.base.width;
        let h = a * Layout.explosion.base.height;

        this.sticker.stick(tag, 
            Layout.explosion.center.x - w * 0.5,
            Layout.explosion.center.y - h * 0.5,
            w, h);
    }


}