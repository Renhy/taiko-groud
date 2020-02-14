import { httpGet }from './utils.js';
import { Controller } from './controller.js';
import { AudioPlayer } from './audio-player.js';

main();


async function main() {
    var audioPlayer = new AudioPlayer();
    var controller = new Controller();

    let s = await audioPlayer.load('/songs/qby.ogg');
    await controller.init();


    // audioPlayer.play(s)
    controller.start();

}