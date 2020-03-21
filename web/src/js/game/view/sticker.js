import { createProgramFromUrl, loadTextureFromUrl } from "./gl-utils.js";


export class Sticker {

    async init(gl) {
        this.gl = gl;
        this.stick = this.stick.bind(this);

        this.program = await createProgramFromUrl(gl, [
            '/src/shader/sticker-vertex-shader.glsl', 
            '/src/shader/sticker-fragment-shader.glsl']);

        this.programLocations = this.initLocaltion(gl, this.program);
        this.programBuffers = this.initBuffer(gl);
        this.textures = {};
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

    async loadTexture(tag, url) {
        let texture = await loadTextureFromUrl(this.gl, url);
        this.textures[tag] = texture;
    }

    stick(tag, x, y, width, height) {
        let gl = this.gl;
        let info = this.textures[tag];

        gl.bindTexture(gl.TEXTURE_2D, info.texture);
        gl.useProgram(this.program);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,this.programBuffers.position);
        gl.enableVertexAttribArray(this.programLocations.position);
        gl.vertexAttribPointer(this.programLocations.position, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.programBuffers.texcoord);
        gl.enableVertexAttribArray(this.programLocations.texcoord);
        gl.vertexAttribPointer(this.programLocations.texcoord, 2, gl.FLOAT, false, 0, 0);

        let matrix = mat4.create();
        mat4.ortho(matrix, 0, 1, 1, 0, -1, 1);
        mat4.translate(matrix, matrix, [x, y, 0]);
        mat4.scale(matrix, matrix, [width, height, 1]);

        gl.uniformMatrix4fv(this.programLocations.matrix, false, matrix);
        gl.uniform1i(this.programLocations.texture, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

}

