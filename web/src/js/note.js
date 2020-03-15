import { createProgramFromUrl, loadTextureFromUrl } from './gl-utils.js';
import { BeatType } from './constant.js';

var NoteSize = {
    width: 71 / 1280,
    height: 71 / 720
};

export class Note {
    async init(gl) {
        this.gl = gl;
        this.drawTexture = this.drawTexture.bind(this);

        this.beatWidth = 71 / 1280;
        this.beatHeight = 71 / 720;

        this.program = await createProgramFromUrl(this.gl, [
            '/src/shader/note-vertex-shader.glsl', 
            '/src/shader/note-fragment-shader.glsl']);
        
        this.programLocations = this.initLocaltion(this.gl, this.program);
        this.programBuffers = this.initBuffer(this.gl);
        this.textures = await this.initTexture(this.gl);
    }

    initLocaltion(gl, program) {
        return {
            position: gl.getAttribLocation(program, "a_position"),
            texcoord: gl.getAttribLocation(program, "a_texcoord"),

            matrix: gl.getUniformLocation(program, "u_matrix"),
            texture: gl.getUniformLocation(program, "u_texture"), 
        };
    }

    initBuffer(gl) {
        let positions = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


        let texcoords = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        let texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

        return {
            position : positionBuffer,
            texcoord : texcoordBuffer,
        };
    }

    async initTexture(gl) {
        let textureDo = await loadTextureFromUrl(gl, '/assets/img/do.png');
        let textureKa = await loadTextureFromUrl(gl, '/assets/img/ka.png');

        return {
            do: textureDo,
            ka: textureKa,
        };
    }

    render(state) {
        let w = this.gl.canvas.width;
        let h = this.gl.canvas.height;


        this.drawTexture(
            this.textures.do,
            w * 0.2, h * 0.5,
            NoteSize.width * w, NoteSize.height * h);
        for (let i = state.nextBeats.length - 1; i >= 0; i--) {
            let beat = state.nextBeats[i];

            let dstX = beat.distance * w * 0.8 + 0.2 * w;
            let dstY = h * 0.5;

            if (beat.type == BeatType.DO) {
                this.drawTexture(
                    this.textures.do, 
                    dstX, dstY, 
                    NoteSize.width * w, NoteSize.height * h);
            }
            if (beat.type == BeatType.KA) {
                this.drawTexture(
                    this.textures.ka, 
                    dstX, dstY, 
                    NoteSize.width * w, NoteSize.height * h);
            }
        }
    }

    drawTexture(info, x, y, width, height) {
        let gl = this.gl;
        if (width === undefined) {
            width = info.width;
        }

        if (height === undefined) {
            height = info.height;
        }

        gl.bindTexture(gl.TEXTURE_2D, info.texture);

        gl.useProgram(this.program);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,this.programBuffers.position);
        gl.enableVertexAttribArray(this.programLocations.position);
        gl.vertexAttribPointer(this.programLocations.position, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.programBuffers.texcoord);
        gl.enableVertexAttribArray(this.programLocations.texcoord);
        gl.vertexAttribPointer(this.programLocations.texcoord, 2, gl.FLOAT, false, 0, 0);

        let matrix = mat4.create();
        mat4.ortho(matrix, 0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
        mat4.translate(matrix, matrix, [x, y, 0]);
        mat4.scale(matrix, matrix, [width, height, 1]);

        gl.uniformMatrix4fv(this.programLocations.matrix, false, matrix);
        gl.uniform1i(this.programLocations.texture, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

    }
        
    
}


