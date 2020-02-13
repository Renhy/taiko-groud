import { httpGet }from './utils.js';
import { Game } from './game.js';

main();


async function main() {
    const canvas = document.querySelector("#gamecanvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    var game = new Game(gl);
    await game.init();
    game.go();

}