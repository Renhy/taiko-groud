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
    MODE_AUTO: 11,
    MODE_TRAIN: 12,
    UNKOWN: 13,
};

export class Keyboard {

    constructor() {
        const keyboard = this;
        document.addEventListener('keydown', function (event) {
            keyboard.keyDown(event);
        });

        this.keyMap = {
            leftDo: ['f', 'F'],
            rightDo: ['j', 'J'],
            leftKa: ['r', 'R', 'd', 'D'],
            rightKa: ['u', 'U', 'k', 'K'],
            esc: ['Escape'],
            ok: ['Enter'],
            up: ['ArrowUp'],
            down: ['ArrowDown'],
            left: ['ArrowLeft'],
            right: ['ArrowRight'],
            modeAuto: ['F8'],
            modeTrain: ['F9'],
        };
    }

    setCallback(callback) {
        this.callback = callback;
    }

    keyDown(event) {
        if (event.repeat) {
            return;
        }

        let key = this.handle(event);
        if (key) {
            this.callback.handle(key);
        }
    }

    handle(event) {
        let key = {
            value: Keys.UNKOWN,
            ts: event.timeStamp
        };

        if (this.keyMap.leftDo.includes(event.key)) {
            key.value = Keys.LEFT_DO;
            return key;
        }
        if (this.keyMap.rightDo.includes(event.key)) {
            key.value = Keys.RIGHT_DO;
            return key;
        }
        if (this.keyMap.leftKa.includes(event.key)) {
            key.value = Keys.LEFT_KA;
            return key;
        }
        if (this.keyMap.rightKa.includes(event.key)) {
            key.value = Keys.RIGHT_KA;
            return key;
        }
        if (this.keyMap.esc.includes(event.key)) {
            key.value = Keys.ESC;
            return key;
        }
        if (this.keyMap.ok.includes(event.key)) {
            key.value = Keys.OK;
            return key;
        }
        if (this.keyMap.up.includes(event.key)) {
            key.value = Keys.UP;
            return key;
        }
        if (this.keyMap.down.includes(event.key)) {
            key.value = Keys.DOWN;
            return key;
        }
        if (this.keyMap.left.includes(event.key)) {
            key.value = Keys.LEFT;
            return key;
        }
        if (this.keyMap.right.includes(event.key)) {
            key.value = Keys.RIGHT;
            return key;
        }
        if (this.keyMap.modeAuto.includes(event.key)) {
            key.value = Keys.MODE_AUTO
            return key;
        }
        if (this.keyMap.modeTrain.includes(event.key)) {
            key.value = Keys.MODE_TRAIN;
            return key;
        }
        return key;
    }

}