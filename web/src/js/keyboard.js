export var Keys = {
    LEFT_DO: 1,
    RIGHT_DO: 2,
    LEFT_KA: 3,
    RIGHT_KA: 4,
    ESC: 5,
    OK: 6,
    UP: 7,
    DOWN: 8,
    LEFT: 9,
    RIGHT: 10,
};

export class Keyboard {

    constructor(callback) {
        this.callback = callback;

        const keyboard = this;
        document.addEventListener('keydown', function (event) {
            keyboard.keyDown(event);
        });

        this.keyMap = {
            leftDo: 'f',
            rightDo: 'j',
            leftKa: 'r',
            rightKa: 'u',
            esc: 'Escape',
            ok: 'Enter',
            up: 'ArrowUp',
            down: 'ArrowDown',
            left: 'ArrowLeft',
            right: 'ArrowRight',
        };
    }

    keyDown(event) {
        if (event.repeat) {
            return;
        }

        let key = this.handle(event);
        if (key) {
            this.callback(key);
        }
    }

    handle(event) {
        let key = event.key;
        switch(key) {
            case this.keyMap.leftDo:
                return Keys.LEFT_DO;
            case this.keyMap.rightDo:
                return Keys.RIGHT_DO;
            case this.keyMap.leftKa:
                return Keys.LEFT_KA;
            case this.keyMap.rightKa:
                return Keys.RIGHT_KA;
            case this.keyMap.ok:
                return Keys.OK;
            case this.keyMap.esc:
                return Keys.ESC;
            case this.keyMap.up:
                return Keys.UP;
            case this.keyMap.down:
                return Keys.DOWN;
            case this.keyMap.left:
                return Keys.LEFT;
            case this.keyMap.right:
                return Keys.RIGHT;
            default:
                return;
        }
    }

}