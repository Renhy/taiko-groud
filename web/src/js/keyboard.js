export class Keyboard {

    constructor(dom, callback) {
        this.callback = callback;

        console.log(document.hasFocus());
        document.addEventListener('keydown', function (event) {
            if (event.repeat) {
                return;
            }
            callback(event);
        });

        // dom.tabIndex = 1;
        // dom.focus();
        // dom.addEventListener('keydown', function(event) {
        //     if (event.repeat) {
        //         return;
        //     }
        //     callback(event);
        // });

    }



}