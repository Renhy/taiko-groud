import { httpGet }from './utils.js';
import { Game } from './game/game.js';
import { AudioPlayer } from './audio-player.js';
import { Keyboard } from './keyboard.js';
import { CourseType } from './game/constant.js';

main();


async function main() {
    var audioPlayer = new AudioPlayer();
    var game = new Game();
    var keyboard = new Keyboard(game);

    await audioPlayer.init();

    let fontStyle = document.createElement('style');
    fontStyle.type = 'text/css';
    fontStyle.textContent = await httpGet('/src/css/font.css');
    document.head.appendChild(fontStyle);

    const info = {
        id: 'qby',
        audio: '/songs/qby.ogg',
        music: '/songs/qby.tja',
        type: CourseType.HARD,
    };

    await game.init(audioPlayer, info);

}
