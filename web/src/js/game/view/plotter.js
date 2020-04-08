import { resizeCanvasToDisplySize } from './gl-utils.js';
import { Note } from './note.js';
import { Sticker } from './sticker.js';
import { Judge } from './judge.js';
import { httpGet } from '../../utils.js';
import { Overlay } from './overlay.js';
import { Beat } from './beat.js';
import { Back } from './back.js';
import { Gauge } from './gauge.js';

export class Plotter {
    async init(game) {
        this.game = game;
        this.referee = game.referee;

        let gl_matrix = document.createElement('script');
        gl_matrix.text = await httpGet('/src/lib/gl-matrix.js');
        document.head.appendChild(gl_matrix);

        // initialize webgl
        const canvas = document.getElementById('game-canvas');
        this.gl = canvas.getContext('webgl2', {antialias: false});
        if (!this.gl) {
            console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        this.enableRenderbuffer = true;
        resizeCanvasToDisplySize(this.gl.canvas);

        this.enable = false;

        this.back = new Back();
        await this.back.init(this.game);
        this.overlay = new Overlay();
        await this.overlay.init(this.game);

        this.sticker = new Sticker();
        await this.sticker.init(this.gl);
        this.note = new Note();
        await this.note.init(this.game);
        this.judge = new Judge();
        await this.judge.init(this.game);
        this.beat = new Beat();
        await this.beat.init(this.game);
        this.gauge = new Gauge();
        await this.gauge.init(this.game);

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

        if (this.enableRenderbuffer) {
            let frameBuffer = gl.createFramebuffer();
            let colorBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, colorBuffer);
            gl.renderbufferStorageMultisample(
                gl.RENDERBUFFER, 4, gl.RGBA8, gl.canvas.width, gl.canvas.height);

            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            gl.framebufferRenderbuffer(
                gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorBuffer);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // enable depth test
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);

        let delta = now - this.startTime;
        this.referee.update(delta);

        this.beat.render(delta);
        this.note.render(delta);
        this.judge.render(delta);
        this.gauge.render(delta);
        this.overlay.updateShake(delta);

        this.fps = 1000 / (performance.now() - start);
        if (this.enable) {
            requestAnimationFrame(this.render);
        }
    }



}