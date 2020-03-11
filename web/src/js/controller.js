import { Keyboard, Keys } from './keyboard.js';
import { Plotter } from './plotter.js';
import { Audios } from './audio-player.js';
import { Music } from './music.js';

var State = {
    INIT : 1,
    RUNNING : 2,
    SUSPEND : 3,
    REUSLT : 4,
};

export class Controller {
    async init(player, info) {
        this.state = State.INIT;
        this.player = player;

        // initialize keyboard input
        this.keyboard = new Keyboard(this);

        // initialize song data
        this.songTag = await this.player.load(info.audio);
        this.music = new Music();
        await this.music.init(info.music);
        this.music.play(info.type);

        // initialize animation component
        this.plotter = new Plotter();
        await this.plotter.init(this.music);

        console.log('Controller initialization completed.');
        console.log(this);
    }

    start() {
        this.state = State.RUNNING;
        console.log('Controller start.');
        console.log(this);

        this.startTime = performance.now();
        this.player.play(this.songTag);
        this.plotter.start(0);
    }

    pause() {
        this.state = State.SUSPEND;
        console.log('Controller pause.');
        console.log(this);

        this.offset = performance.now() - this.startTime;
        this.plotter.pause();
        this.player.pause();
    }

    resume() {
        this.state = State.RUNNING;
        console.log('Controller resume.');
        console.log(this);

        this.startTime = performance.now() - this.offset;
        this.plotter.resume(this.offset);
        this.player.resume();
    }


    handle(key) {

        key.ts = key.ts - this.startTime;
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
        this.player.play(Audios.DO);
        this.start();
    }

    runningHandle(key) {
        switch(key.value) {
            case Keys.ESC:
                this.pause();
                break;

            case Keys.LEFT_DO:
            case Keys.RIGHT_DO:
                this.player.play(Audios.DO);
                this.music.beat(key);
                break;

            case Keys.LEFT_KA:
            case Keys.RIGHT_KA:
                this.player.play(Audios.KA);
                this.music.beat(key);
                break;
        }
    }

    suspendHandle(key) {
        switch(key.value) {
            case Keys.ESC:
                this.resume();
                break;
        }
    }

    resultHandle(key) {

    }
    

}

