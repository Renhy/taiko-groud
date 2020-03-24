import { resizeCanvasToDisplySize } from './gl-utils.js';
import { Note } from './note.js';
import { Sticker } from './sticker.js';
import { Judge } from './judge.js';
import { httpGet } from '../../utils.js';

export class Plotter {
    async init(referee) {
        this.referee = referee;

        let gl_matrix = document.createElement('script');
        gl_matrix.text = await httpGet('/src/lib/gl-matrix.js');
        document.head.appendChild(gl_matrix);

        // initialize webgl
        const canvas = document.getElementById('gamecanvas');
        this.gl = canvas.getContext('webgl');
        if (!this.gl) {
            console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        resizeCanvasToDisplySize(this.gl.canvas);

        this.enable = false;
        this.sticker = new Sticker();
        this.note = new Note();
        this.judge = new Judge();

        await this.sticker.init(this.gl);
        await this.note.init(this.sticker, referee);
        await this.judge.init(this.sticker, referee);

        this.start = this.start.bind(this);
        this.render = this.render.bind(this);
    }


    start (offset) {
        console.log(offset)
        this.enable = true;
        this.startTime = performance.now() - offset;
        requestAnimationFrame(this.render);

        setInterval(() => {
            console.log('fps=' + this.fps);
            
        }, 2000);
    }

    pause() {
        this.enable = false;
    }

    resume(offset) {
        console.log(offset)
        this.enable = true;
        this.startTime = performance.now() - offset;
        requestAnimationFrame(this.render);
    }

    end() {
        this.enable = false;
    }

    render(now) {
        let start = performance.now();

        let gl = this.gl;
        resizeCanvasToDisplySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // enable depth test
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);

        let delta = now - this.startTime;
        this.referee.update(delta);

        this.note.render(delta);
        this.judge.render(delta);

        this.fps = 1000 / (performance.now() - start);
        if (this.enable) {
            requestAnimationFrame(this.render);
        }
    }



}