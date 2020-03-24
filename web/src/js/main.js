import { httpGet }from './utils.js';
import { Controller } from './game/controller.js';
import { AudioPlayer } from './audio-player.js';
import { Keyboard } from './keyboard.js';

main();


async function main() {
    var audioPlayer = new AudioPlayer();
    var controller = new Controller();
    var keyboard = new Keyboard(controller);

    await audioPlayer.init();

    const info = {
        id: 'qby',
        name: '蓄势',
        audio: '/songs/gear-up.ogg',
        music: '/songs/gear-up.tja',
        type: 'Hard',
    };

    await controller.init(audioPlayer, info);

}