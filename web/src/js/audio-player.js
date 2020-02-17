export class AudioPlayer {
    constructor() {
        this.context = new AudioContext();
        this.soundBuffers = {};

    }

    async load(url) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onload = () => {
                this.context.decodeAudioData(request.response, (buffer) => {
                    let tag = this.getNameFromUrl(url);
                    this.soundBuffers[tag] = buffer;
                    resolve(tag);
                });
            };
            request.send();
        });
    }

    play(tag, start) {
        start = start | 0;
        console.log(this.context.state);
        if (this.context.state == 'suspended') {
            this.context.resume().then(() => {
                console.log(this.context.state);
                let source = this.context.createBufferSource();
                let buffer = this.soundBuffers[tag];

                source.buffer = buffer;
                source.connect(this.context.destination);

                source.start(start);

            });
        }


    }

    stop() {

    }

    getNameFromUrl(url) {
        let name = url.slice(url.lastIndexOf('/') + 1);
        return name.slice(0, name.lastIndexOf('.'));
    }

}