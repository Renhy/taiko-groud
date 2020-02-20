import { httpGet }from './utils.js';
import { Controller } from './controller.js';
import { AudioPlayer } from './audio-player.js';

main();


async function main() {
    var audioPlayer = new AudioPlayer();
    var controller = new Controller();

    await audioPlayer.init();
    await controller.init(audioPlayer);

    controller.start();

}