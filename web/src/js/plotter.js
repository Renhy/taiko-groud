import { resizeCanvasToDisplySize } from './gl-utils.js';
import { Note } from './note.js';

export class Plotter {
    async init(music) {
        this.music = music;

        // initialize webgl
        const canvas = document.getElementById('gamecanvas');
        this.gl = canvas.getContext('webgl');
        if (!this.gl) {
            console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        resizeCanvasToDisplySize(this.gl.canvas);

        this.enable = false;
        this.note = new Note();
        await this.note.init(this.gl);

        this.start = this.start.bind(this);
        this.render = this.render.bind(this);
    }


    start (offset) {
        this.enable = true;
        this.startTime = performance.now() - offset;
        requestAnimationFrame(this.render);
    }

    pause() {
        this.enable = false;
    }

    resume() {

    }

    end() {

    }

    render() {
        let gl = this.gl;
        resizeCanvasToDisplySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // enable depth test
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);

        let now =  performance.now();
        let deltaTime = now - this.startTime;
        let state = this.music.readState(deltaTime);

        this.note.render(state);

        if (this.enable) {
            requestAnimationFrame(this.render);
        }
    }



}