import { Keys } from '../keyboard.js';
import { Plotter } from './view/plotter.js';
import { Audios } from '../audio-player.js';
import { Referee } from './referee.js';
import { httpGet } from '../utils.js';

var State = {
    INIT: 1,
    READY : 2,
    RUNNING : 3,
    SUSPEND : 4,
    REUSLT : 5,
};

var Delay = 1000;

export class Game {
    async init(player, info) {
        this.state = State.INIT;
        this.player = player;
        this.songInfo = info;

        await this.loadHtml();
        
        let keyIntro = document.getElementById('game-load-key');
        await new Promise((resolve, reject) => {
            keyIntro.onload = () => {
                return resolve();
            }
            keyIntro.src = '/assets/img/key.png';
        });

        this.songTag = await this.player.load(this.songInfo.audio);
        this.referee = new Referee(this, this.player, () => {
            this.end();
        });
        await this.referee.loadMusic(this.songInfo.music, this.songInfo.type);

        this.plotter = new Plotter();
        await this.plotter.init(this);

        this.ready();
    }

    async loadHtml() {
        let page = await httpGet('/src/html/game.html');
        document.getElementById('screen').innerHTML = page;

        let gameCss = document.createElement('style');
        gameCss.type = 'text/css';
        gameCss.textContent = await httpGet('/src/css/game.css');
        document.head.appendChild(gameCss);

        let loadCss = document.createElement('style');
        loadCss.type = 'text/css';
        loadCss.textContent = await httpGet('/src/css/game-load.css');
        document.head.appendChild(loadCss);

        let resultCss = document.createElement('style');
        resultCss.type = 'text/css';
        resultCss.textContent = await httpGet('/src/css/game-result.css');
        document.head.appendChild(resultCss);
    }

    ready() {
        this.state = State.READY;
        console.log('Controller initialization ready.', this);
        console.log('Waiting for input.');

        let intro = document.getElementById('game-load-intro');
        intro.innerText = '按「F」、「J」开始';
    }

    start() {
        this.state = State.RUNNING;
        console.log('Controller start.');
        console.log(this);

        let load = document.getElementById('game-load');
        load.remove();

        this.plotter.start(Delay * -1);
        this.startTime = performance.now() + Delay;
        setTimeout(() => {
            this.offset = performance.now() - this.startTime;
            this.player.play(
                this.songTag, 
                this.offset * 0.001, 
                this.referee.music.metaData.songVol * 0.007);
        }, Delay);
    }

    end() {
        this.plotter.end();
        
        document.getElementById('result-good-count').innerText = this.referee.result.good;
        document.getElementById('result-ok-count').innerText = this.referee.result.ok;
        document.getElementById('result-bad-count').innerText = this.referee.result.bad;
        document.getElementById('result-combo-count').innerText = this.referee.result.combo;
        document.getElementById('result-roll-count').innerText = this.referee.result.roll;

        let page = document.getElementById('game-result');
        page.style.visibility = 'visible';
    }

    pause() {
        this.state = State.SUSPEND;
        console.log('Controller pause.');
        console.log(this);

        this.offset = performance.now() - this.startTime;
        this.plotter.pause();
        this.player.pause();
    }

    resume() {
        this.state = State.RUNNING;
        console.log('Controller resume.');
        console.log(this);

        this.startTime = performance.now() - this.offset;

        this.plotter.resume(this.offset);
        this.player.resume();
    }




    handle(key) {
        key.ts = key.ts - this.startTime;
        switch(this.state) {
            case State.INIT:
                return this.initHandle(key);
            case State.READY:
                return this.readyHandle(key);
            case State.RUNNING:
                return this.runningHandle(key);
            case State.SUSPEND:
                return this.suspendHandle(key);
            case State.RESULT:
                return this.resultHandle(key);
        }
    }

    initHandle (key) {
    }

    readyHandle(key) {
        switch (key.value) {
            case Keys.LEFT_DO:
            case Keys.RIGHT_DO:
                this.player.play(Audios.DO);
                this.start();
                break;
        }
    }

    runningHandle(key) {
        switch(key.value) {
            case Keys.ESC:
                this.pause();
                break;

            case Keys.LEFT_DO:
            case Keys.RIGHT_DO:
                this.player.play(Audios.DO);
                this.referee.beat(key);
                break;

            case Keys.LEFT_KA:
            case Keys.RIGHT_KA:
                this.player.play(Audios.KA);
                this.referee.beat(key);
                break;
        }
    }

    suspendHandle(key) {
        switch(key.value) {
            case Keys.ESC:
                this.resume();
                break;
        }
    }

    resultHandle(key) {

    }
    

}

