import { createProgramFromUrl, loadTextureFromUrl } from './gl-utils.js';
import { BeatType } from './constant.js';

var beatSize = {
    width: 71 / 1280,
    height: 71 / 720
};

export class Note {
    async init(gl) {
        this.gl = gl;
        this.drawImage = this.drawImage.bind(this);

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
        let h = this.gl.canvas.height / 2;

        for (let i = state.beats.length - 1; i >= 0; i--) {
            let beat = state.beats[i];

            let dstX = beat.distance * w;
            let dstY = h;

            if (beat.type == BeatType.DO) {
                let texture = this.textures.do;
                this.drawImage(texture.texture, texture.width, texture.height, dstX, dstY);
            }
            if (beat.type == BeatType.KA) {
                let texture = this.textures.ka;
                this.drawImage(texture.texture, texture.width, texture.height, dstX, dstY);
            }
        }
    }

    drawImage(texture, texWidth, texHeight, dstX, dstY, dstWidth, dstHeight) {
        let gl = this.gl;
        if (dstWidth === undefined) {
            dstWidth = texWidth;
        }

        if (dstHeight === undefined) {
            dstHeight = texHeight;
        }

        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.useProgram(this.program);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,this.programBuffers.position);
        gl.enableVertexAttribArray(this.programLocations.position);
        gl.vertexAttribPointer(this.programLocations.position, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.programBuffers.texcoord);
        gl.enableVertexAttribArray(this.programLocations.texcoord);
        gl.vertexAttribPointer(this.programLocations.texcoord, 2, gl.FLOAT, false, 0, 0);

        let matrix = mat4.create();
        mat4.ortho(matrix, 0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
        mat4.translate(matrix, matrix, [dstX, dstY, 0]);
        mat4.scale(matrix, matrix, [dstWidth, dstHeight, 1]);

        gl.uniformMatrix4fv(this.programLocations.matrix, false, matrix);
        gl.uniform1i(this.programLocations.texture, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

    }
        
    
}


