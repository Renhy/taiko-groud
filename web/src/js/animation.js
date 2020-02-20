import { resizeCanvasToDisplySize } from './gl-utils.js';
import { Note } from './note.js';

export class Animation {
    async init(gl) {
        if (!gl) {
            console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        this.gl = gl;
        resizeCanvasToDisplySize(this.gl.canvas);

        this.then = 0;
        this.enable = false;
        this.note = new Note();
        await this.note.init(gl);

        this.start = this.start.bind(this);
        this.render = this.render.bind(this);
    }


    start (offset) {
        this.enable = true;
        this.startTime = Date.now() - offset;
        requestAnimationFrame(this.render);
    }

    pause() {
        this.enable = false;
    }

    resume() {

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

        if (this.enable) {
            requestAnimationFrame(this.render);
        }
    }

}