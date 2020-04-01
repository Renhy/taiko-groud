import { Keys } from '../keyboard.js';
import { httpGet } from '../utils.js';
import { BeatMap } from './constant.js';


export class Music {
    async init(url, courseType) {
        let text = await this.load(url);
        let lines = text.split('\n');

        this.metaData = {
            title: '',
            subTitle: '',
            bpm: 120,
            offset: -0.0,
            songVol: 100,
            seVol: 100,
            demoStart: 0,
        };
        this.type = courseType;
        this.measures = [];
        this.beats = [];

        this.parse(courseType, lines);
    }

    async load(url) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onload = () => {
                let response = new Uint8Array(request.response);
                let text = new TextDecoder('sjis').decode(response);
                resolve(text);
            };
            request.send();
        });
    }

    parse(type, lines) {
        let startIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            this.parseMetadata(line);
            if (line.indexOf('COURSE') >= 0) {
                if (type == line.slice(line.indexOf(':') + 1).trim()) {
                    startIndex = i;
                    break;
                }
            }
        }
        if (startIndex < 0) {
            console.error('Can not found type of ' + type);
            return;
        }

        let endIndex = lines.length - 1;
        for (let i = startIndex; i< lines.length; i++) {
            if (lines[i].indexOf('#END') >= 0) {
                endIndex = i;
                break;
            }
        }

        this.parseCourse(lines, startIndex, endIndex);
    }

    parseMetadata(line) {
        if (line.indexOf('SUBTITLE') >= 0) {
            this.metaData.subTitle = line.slice(line.indexOf(':') + 1).trim();
            return;
        }
        if (line.indexOf('TITLE') >= 0) {
            this.metaData.title = line.slice(line.indexOf(':') + 1).trim();
            return;
        }
        if (line.indexOf('BPM') >= 0) {
            let bpm = line.slice(line.indexOf(':') + 1).trim();
            if (bpm.indexOf('-') >= 1) {
                bpm = bpm.slice(0, bpm.indexOf('-') - 1)
            }
            this.metaData.bpm = parseFloat(bpm);
            return;
        }
        if (line.indexOf('OFFSET') >= 0) {
            let offset = line.slice(line.indexOf(':') + 1).trim();
            this.metaData.offset = parseFloat(offset);
            return;
        }
        if (line.indexOf('SONGVOL') >= 0) {
            let vol = line.slice(line.indexOf(':') + 1).trim();
            this.metaData.songVol = parseInt(vol);
            return;
        }
        if (line.indexOf('SEVOL') >= 0) {
            let vol = line.slice(line.indexOf(':') + 1).trim();
            this.metaData.seVol = parseInt(vol);
            return;
        }
        if (line.indexOf('DEMOSTART') >= 0) {
            let demoStart = line.slice(line.indexOf(':') + 1).trim();
            this.metaData.demoStart = parseFloat(demoStart);
            return;
        }
    }

    parseCourse(lines, start, end) {
        // parse course information
        for (let i = start; i <= end; i++) {
            let line = lines[i];
            if (line.trim() == '') {
                continue;
            }

            if (line.indexOf('LEVEL') >= 0) {
                this.level = parseInt(line.slice(line.indexOf(':') + 1).trim());
            }
            if (line.indexOf('BALLOON') >= 0) {
                let str = line.slice(line.indexOf(':') + 1).trim();
                if (str != '') {
                    this.balloonCounts = [];
                    for (let count of str.split(',')) {
                        this.balloonCounts.push(parseInt(count.trim()));
                    }
                }
            }
            if (line.indexOf('#START') >= 0) {
                start = i + 1;
                break;
            }
        }
        
        let bpm = this.metaData.bpm;
        let timePerMeasure = 4 * 60 * 1000 / bpm;
        let currentTime = this.metaData.offset * -1000;
        let cachedCommands = [];
        for (let i = start; i <= end; i++) {
            let line = lines[i];

            // parse command
            if (line.indexOf('#') >= 0) {
                line = line.slice(line.indexOf('#') + 1).trim();
                // TODO parse command
                cachedCommands.push(line);
                continue;
            }

            // parse measure
            line = line.slice(0, line.indexOf(',')).trim();
            let measure = {
                start: currentTime,
                duration: timePerMeasure,
                line: line,
                commands: cachedCommands,
            };
            this.measures.push(measure);
            cachedCommands = []
            if (line.length == 0) {
                currentTime += timePerMeasure;
                continue
            }

            // parse beat
            let beatCount = line.length;
            let timePerBeat = measure.duration / beatCount;
            for (let b of line) {
                if (BeatMap[b]) {
                    let beat = {
                        ts: currentTime,
                        type: BeatMap[b],
                    };
                    this.beats.push(beat);
                }

                currentTime += timePerBeat;
            } 
        }
    }
}