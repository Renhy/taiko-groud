import { httpGet } from '../../utils.js';

async function createProgramFromUrl(gl, urls, opt_attribs, opt_locations) {
    const shaders = [];
    for (let url of urls) {
        let shader = await loadShaderFromUrl(gl, url);
        shaders.push(shader);
    }
    return createProgram(gl, shaders, opt_attribs, opt_locations);
}

function createProgram(gl, shaders, opt_attribs, opt_locations) {
    const program = gl.createProgram();
    for (let shader of shaders) {
        gl.attachShader(program, shader);
    }
    if (opt_attribs) {
        opt_attribs.forEach(function (attrib, ndx) {
            gl.bindAttribLocation(
                program,
                opt_locations ? opt_locations[ndx] : ndx,
                attrib);
        });
    }
    gl.linkProgram(program);

    // check result
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        const msg = gl.getProgramInfoLog(program);
        error('*** Error in program link: ' + msg);

        gl.deleteProgram(program);
        return null;
    }

    return program;
}

function loadShader(gl, shaderSource, shaderType) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    // check result
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        const msg = gl.getShaderInfoLog(shader);
        console.error('*** Error compiling shader ' + shader + ': ' + msg);
        return null;
    }
    
    return shader;
}

async function loadShaderFromUrl(gl, url) {
    let shaderSource = await httpGet(url);
    let shaderType;
    if (url.indexOf('vertex') != -1) {
        return loadShader(gl, shaderSource, gl.VERTEX_SHADER);
    }
    if (url.indexOf('fragment') != -1) {
        return loadShader(gl, shaderSource, gl.FRAGMENT_SHADER);
    }

    console.error('load shader error, unkown type in url=' + url);
}

async function loadTextureFromUrl(gl, url) {
    return new Promise((resolve, reject) => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
    
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));
    
        var textureInfo = {
            width: 1,
            height: 1,
            texture: texture,
        };
        const image = new Image();
        image.onload =  () => {
            textureInfo.width = image.width;
            textureInfo.height = image.height;
    
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                gl.RGBA, gl.UNSIGNED_BYTE, image);
    
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }

            return resolve(textureInfo);
        };
        image.src = url;
    });
}

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

function resizeCanvasToDisplySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}


export {
    createProgramFromUrl,
    createProgram,
    loadTextureFromUrl,
    resizeCanvasToDisplySize,
};