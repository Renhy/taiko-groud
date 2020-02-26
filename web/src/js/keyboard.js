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
    NONE: 11,
};

export class Keyboard {

    constructor(callback) {
        this.callback = callback;

        const keyboard = this;
        document.addEventListener('keydown', function (event) {
            keyboard.keyDown(event);
        });

        this.keyMap = {
            leftDo: ['f'],
            rightDo: ['j'],
            leftKa: ['r'],
            rightKa: ['u'],
            esc: ['Escape'],
            ok: ['Enter'],
            up: ['ArrowUp'],
            down: ['ArrowDown'],
            left: ['ArrowLeft'],
            right: ['ArrowRight'],
        };
    }

    keyDown(event) {
        if (event.repeat) {
            return;
        }

        console.log(performance.now());
        console.log(event.timeStamp);

        let key = this.handle(event);
        if (key) {
            this.callback.handle(key);
        }
    }

    handle(event) {
        let key = {
            value: Keys.NONE,
            ts: event.timeStamp
        };

        let input = event.key;
        if (this.keyMap.LEFT_DO.includs(input)) {
            key.value = Keys.LEFT_DO;
            return key;
        }
        if (this.keyMap.RIGHT_DO.includs(input)) {
            key.value = Keys.RIGHT_DO;
            return key;
        }
        if (this.keyMap.LEFT_KA.includs(input)) {
            key.value = Keys.LEFT_KA;
            return key;
        }
        if (this.keyMap.RIGHT_KA.includs(input)) {
            key.value = Keys.RIGHT_KA;
            return key;
        }
        if (this.keyMap.LEFT_DO.includs(input)) {
            key.value = Keys.LEFT_DO;
            return key;
        }
        if (this.keyMap.LEFT_DO.includs(input)) {
            key.value = Keys.LEFT_DO;
            return key;
        }
        switch(input) {
            case this.keyMap.rightKa:
                key.value = Keys.LEFT_DO;
                break;
                return Keys.RIGHT_KA;
            case this.keyMap.ok:
                key.value = Keys.LEFT_DO;
                break;
                return Keys.OK;
            case this.keyMap.esc:
                key.value = Keys.LEFT_DO;
                break;
                return Keys.ESC;
            case this.keyMap.up:
                key.value = Keys.LEFT_DO;
                break;
                return Keys.UP;
            case this.keyMap.down:
                key.value = Keys.LEFT_DO;
                break;
                return Keys.DOWN;
            case this.keyMap.left:
                key.value = Keys.LEFT_DO;
                break;
                return Keys.LEFT;
            case this.keyMap.right:
                key.value = Keys.LEFT_DO;
                break;
                return Keys.RIGHT;
            default:
                return;
        }

        return key;
    }

}