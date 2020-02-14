import { resizeCanvasToDisplySize } from './gl-utils.js';
import { Note } from './note.js';

export class Controller {
    constructor() {
        this.canvas = document.querySelector("#gamecanvas");
        this.gl = this.canvas.getContext("webgl");
    
        if (!this.gl) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        resizeCanvasToDisplySize(this.gl.canvas);

        this.start = this.start.bind(this);
        this.render = this.render.bind(this);

        this.note = new Note(this.gl);
    }

    async init() {
        await this.note.init();

    }


    start () {
        this.then = 0;
        requestAnimationFrame(this.render);

    }

    pause() {

    }

    close() {

    }

    end() {

    }


    render(time) {
        let now = time * 0.001;
        let deltaTime = Math.min(0.1, now - this.then); 
        this.then = now;

        resizeCanvasToDisplySize(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.note.render(deltaTime);

        requestAnimationFrame(this.render);
    }

}

