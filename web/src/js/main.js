import { httpGet }from './utils.js';
import { Game } from './game/game.js';
import { AudioPlayer } from './audio-player.js';
import { Keyboard } from './keyboard.js';

main();


async function main() {
    var audioPlayer = new AudioPlayer();
    var game = new Game();
    var keyboard = new Keyboard(game);

    await audioPlayer.init();

    const info = {
        id: 'qby',
        name: '蓄势',
        audio: '/songs/gear-up.ogg',
        music: '/songs/gear-up.tja',
        type: 'Hard',
    };

    await game.init(audioPlayer, info);

}