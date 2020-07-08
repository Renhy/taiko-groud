import { httpGet }from './utils.js';
import { Game } from './game/game.js';
import { AudioPlayer } from './audio-player.js';
import { Keyboard } from './keyboard.js';
import { CourseType } from './game/constant.js';

main();


async function main() {

    var audioPlayer = new AudioPlayer();
    var keyboard = new Keyboard();

    var info = detectInfo();
    if (info === undefined) {
        info = {
            id: 'xj',
            // audio: '/songs/chengrenyuQ.ogg',
            // music: '/songs/chengrenyuQ.tja',
            audio: '/songs/xj.ogg',
            music: '/songs/xj.tja',
            type: CourseType.EXTREME,
        };
    } 
    await audioPlayer.init();

    let fontStyle = document.createElement('style');
    fontStyle.type = 'text/css';
    fontStyle.textContent = await httpGet('/src/css/font.css');
    document.head.appendChild(fontStyle);


    var game = new Game();
    keyboard.setCallback(game);
    await game.init(audioPlayer, info);
}

function detectInfo() {
    let href = window.location.href;
    if (href.indexOf('?') <= 0) {
        return;
    }

    let params = href.slice(href.indexOf('?') + 1).split('&');;

    let info = {};
    for (let param of params) {
        let kv = param.split('=');
        info[kv[0]] = kv[1];
    }

    if (info.id) {
        return info;
    }
}
