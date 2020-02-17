import { Keyboard } from './keyboard.js';
import { Animation } from './animation.js';

export class Controller {
    constructor(player) {
        this.player = player;

        // initialize webgl for animation
        const canvas = document.getElementById('gamecanvas');
        const gl = canvas.getContext('webgl');
        this.animation = new Animation(gl);

        // initialize keyboard input
        this.keyboard = new Keyboard(this.input);
        

    }

    async init() {
        await this.animation.init();
        this.songTag = await this.player.load('/songs/qby.ogg');

    }

    start() {
        this.animation.start();

    }

    input(event) {
        console.log(event);

    }


    

}

