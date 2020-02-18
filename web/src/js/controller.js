import { Keyboard, Keys } from './keyboard.js';
import { Animation } from './animation.js';
import { Audios } from './audio-player.js';

export class Controller {
    constructor(player) {
        this.player = player;

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
        this.animation.start();
        this.player.play(this.songTag);

    }

    pause() {
        this.animation.pause();
        this.player.pause();
    }

    handle(key) {
        if (key == Keys.ESC) {
            return this.pause();
        }
        if (key == Keys.OK) {
            return this.start();
        }
        if (key == Keys.LEFT_DO || key == Keys.RIGHT_DO) {
            this.player.play(Audios.DO);
        }
        if (key == Keys.LEFT_KA || key == Keys.RIGHT_KA) {
            this.player.play(Audios.KA);
        }
        console.log(key);
    }
    

}

