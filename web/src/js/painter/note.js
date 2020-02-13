import { createProgramFromUrl, loadTextureFromUrl } from './gl-utils.js';

export class Note {
    constructor(gl) {
        this.gl = gl;
        this.drawImage = this.drawImage.bind(this);

        this.doWidth = 71 / 1280;
        this.kaWidth = 71 / 720;
    }

    async init() {
        let gl = this.gl;
        this.program = await createProgramFromUrl(this.gl, [
            '/src/shader/note-vertex-shader.glsl', 
            '/src/shader/note-fragment-shader.glsl']);
        
        this.programLocations = this.initLocaltion(this.gl, this.program);
        this.programBuffers = this.initBuffer(this.gl);
        this.textures = await this.initTexture(this.gl);

        this.drawInfos = [];
        var numToDraw = 100;
        this.speed = 60;
        for (var ii = 0; ii < numToDraw; ++ii) {
            var drawInfo = {
                x: Math.random() * this.gl.canvas.width,
                y: Math.random() * this.gl.canvas.height,
                dx: Math.random() > 0.5 ? -1 : 1,
                dy: Math.random() > 0.5 ? -1 : 1,
                xScale: Math.random() * 0.25 + 0.25,
                yScale: Math.random() * 0.25 + 0.25,
                textureInfo: this.textures.do,
            };
            this.drawInfos.push(drawInfo);
        }
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

    render(deltaTime) {
        let speed = this.speed;
        var gl = this.gl;
        this.drawInfos.forEach(function (drawInfo) {
            drawInfo.x += drawInfo.dx * speed * deltaTime;
            drawInfo.y += drawInfo.dy * speed * deltaTime;
            if (drawInfo.x < 0) {
                drawInfo.dx = 1;
            }
            if (drawInfo.x >= gl.canvas.width) {
                drawInfo.dx = -1;
            }
            if (drawInfo.y < 0) {
                drawInfo.dy = 1;
            }
            if (drawInfo.y >= gl.canvas.height) {
                drawInfo.dy = -1;
            }
        });

        for (let drawInfo of this.drawInfos) {
            var dstX = drawInfo.x;
            var dstY = drawInfo.y;
            var dstWidth = drawInfo.textureInfo.width * drawInfo.xScale;
            var dstHeight = drawInfo.textureInfo.height * drawInfo.yScale;

            this.drawImage(
                drawInfo.textureInfo.texture,
                drawInfo.textureInfo.width,
                drawInfo.textureInfo.height,
                dstX, dstY, dstWidth, dstHeight);
 
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


