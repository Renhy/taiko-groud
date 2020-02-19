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
    constructor(player) {
        this.player = player;
        this.state = State.INIT;

        // initialize webgl for animation
        const canvas = document.getElementById('gamecanvas');
        const gl = canvas.getContext('webgl');
        this.animation = new Animation(gl);

        // initialize keyboard input
        this.keyboard = new Keyboard(this);
        
    }

    async init() {
        await this.animation.init();
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
        if (this.state == State.INIT) {
            return this.initHandle(key);
        }
        if (this.state == State.RUNNING) {
            return this.runningHandle(key);
        }
        if (this.state == State.SUSPEND) {
            return this.suspendHandle(key);
        }
        if (this.state == State.RESULT) {
            return this.resultHandle(key);
        }
    }

    initHandle (key) {
        return;
    }

    runningHandle(key) {
        if (key == Keys.ESC) {
            return this.pause();
        }
        if (key == Keys.LEFT_DO || key == Keys.RIGHT_DO) {
            this.player.play(Audios.DO);
        }
        if (key == Keys.LEFT_KA || key == Keys.RIGHT_KA) {
            this.player.play(Audios.KA);
        }
    }

    suspendHandle(key) {
        if (key == Keys.ESC) {
            return this.resume();
        }


    }

    resultHandle(key) {

    }
    

}

