import { Keyboard, Keys } from './keyboard.js';
import { Animation } from './animation.js';
import { Audios } from './audio-player.js';

var State = {
    INIT : 1,
    RUNNING : 2,
    SUSPEND : 3,
    REUSLT : 4,
};

export class Controller {
    async init(player) {
        this.player = player;
        this.state = State.INIT;

        // initialize webgl for animation
        const canvas = document.getElementById('gamecanvas');
        const gl = canvas.getContext('webgl');

        // initialize keyboard input
        this.keyboard = new Keyboard(this);


        this.animation = new Animation();
        await this.animation.init(gl);
        this.songTag = await this.player.load('/songs/qby.ogg');
    }

    start() {
        this.state = State.RUNNING;

        this.player.play(this.songTag);
        this.startTime = Date.now();

        this.animation.start(0);
    }

    pause() {
        this.state = State.SUSPEND;
        this.offset = Date.now() - this.startTime;

        this.animation.pause();
        this.player.pause();
    }

    resume() {
        this.state = State.RUNNING;

        this.animation.resume(this.offset);
        this.player.resume();

    }


    handle(key) {
        switch(this.state) {
            case State.INIT:
                return this.initHandle(key);
            case State.RUNNING:
                return this.runningHandle(key);
            case State.SUSPEND:
                return this.suspendHandle(key);
            case State.RESULT:
                return this.resultHandle(key);
        }
    }

    initHandle (key) {
        return;
    }

    runningHandle(key) {
        switch(key) {
            case Keys.ESC:
                this.pause();
                break;

            case Keys.LEFT_DO:
            case Keys.RIGHT_DO:
                this.player.play(Audios.DO);
                break;

            case Keys.LEFT_KA:
            case Keys.RIGHT_KA:
                this.player.play(Audios.KA);
                break;
        }
    }

    suspendHandle(key) {
        switch(key) {
            case Keys.ESC:
                this.resume();
                break;
        }
    }

    resultHandle(key) {

    }
    

}

