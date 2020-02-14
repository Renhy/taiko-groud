import { httpGet }from './utils.js';
import { Controller } from './controller.js';
import { AudioPlayer } from './audio-player.js';

main();


async function main() {
    const canvas = document.querySelector("#gamecanvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    var audioPlayer = new AudioPlayer();
    var controller = new Controller(gl);


    let s = await audioPlayer.load('/songs/qby.ogg');
    await controller.init();


    // audioPlayer.play(s)
    controller.start();

}