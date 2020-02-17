export class Keyboard {

    constructor(callback) {
        this.callback = callback;

        const keyboard = this;
        document.addEventListener('keydown', function (event) {
            if (event.repeat) {
                return;
            }
            keyboard.keyDown(event);
        });

    }

    keyDown(event) {
        this.callback(event);
    }


}