import { Keys } from './keyboard.js';
import { httpGet } from './utils.js';
import { CourseType, BeatType, BeatMap, JudgeBias, JudgeResult } from './constant.js';


export class Music {
    async init(url) {
        let text = await httpGet(url);
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

        this.courses = {};
        this.parse(lines);
    }

    parse(lines) {
        
        let type = '';
        let current = [];

        for (let line of lines) {
            if (!line || line.trim() == '') {
                continue;
            }

            this.parseMetadata(line);
            
            if (line.indexOf('COURSE') >= 0) {
                type = line.slice(line.indexOf(':') + 1).trim();
                current = [];
            }
            if (line.indexOf('#END') >= 0) {
                this.courses[type] = new Course(this.metaData, current);
            }

            current.push(line);
        }
    }

    parseMetadata(line) {
        if (line.indexOf('TITLE') >= 0) {
            this.metaData.title = line.slice(line.indexOf(':') + 1).trim();
        }
        if (line.indexOf('SUBTITLE') >= 0) {
            this.metaData.subTitle = line.slice(line.indexOf(':') + 1).trim();
        }
        if (line.indexOf('BPM') >= 0) {
            let bpm = line.slice(line.indexOf(':') + 1).trim();
            if (bpm.indexOf('-') >= 1) {
                bpm = bpm.slice(0, bpm.indexOf('-') - 1)
            }
            this.metaData.bpm = parseFloat(bpm);
        }
        if (line.indexOf('OFFSET') >= 0) {
            let offset = line.slice(line.indexOf(':') + 1).trim();
            this.metaData.offset = parseFloat(offset);
        }
        if (line.indexOf('SONGVOL') >= 0) {
            let vol = line.slice(line.indexOf(':') + 1).trim();
            this.metaData.songVol = parseInt(vol);
        }
        if (line.indexOf('SEVOL') >= 0) {
            let vol = line.slice(line.indexOf(':') + 1).trim();
            this.metaData.seVol = parseInt(vol);
        }
        if (line.indexOf('DEMOSTART') >= 0) {
            let demoStart = line.slice(line.indexOf(':') + 1).trim();
            this.metaData.demoStart = parseFloat(demoStart);
        }
    }

    play(type, callback) {
        this.currentCourse = this.courses[type];
        if (!this.currentCourse) {
            console.error('Course type not found');
        }
        this.currentCourse.play(callback);
    }

    beat(key) {
        this.currentCourse.beat(key);

    }

    readState(deltaTime) {
        return this.currentCourse.readState(deltaTime);
    }


}

class Course {
    constructor(metaData, lines) {
        this.metaData = metaData;
        // parse course informations
        let startIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.indexOf('COURSE') >= 0) {
                this.type = line.slice(line.indexOf(':') + 1).trim();
            }
            if (line.indexOf('LEVEL') >= 0) {
                this.level = parseInt(line.slice(line.indexOf(':') + 1).trim());
            }
            if (line.indexOf('BALLOON') >= 0) {
                let str = line.slice(line.indexOf(':') + 1).trim();
                if (str != '') {
                    this.balloonCounts = [];
                    this.balloonCountIndex = 0;
                    for (let count of str.split(',')) {
                        this.balloonCounts.push(parseInt(count.trim()));
                    }
                }
            }

            if (line.indexOf('#START') >= 0) {
                startIndex = i;
                break;
            }
        }

        // parse measure and beat
        this.measures = [];
        this.beats = [];

        let cachedCommands = [];
        let cachedCommandsData = {};

        let bpm = metaData.bpm;
        let timePerMeasure = 4 * 60 * 1000 / bpm;
        let currentTime = metaData.offset * -1000;
        for (let i = startIndex; i < lines.length; i ++) {
            let line = lines[i];
            if (line.trim() == '') {
                continue;
            }

            // handle command
            if (line.indexOf('#') >= 0) {
                line = line.slice(line.indexOf('#') + 1).trim();
                // TODO parse command

                continue;
            }

            // handle measure
            line = line.slice(0, line.indexOf(',')).trim();
            let measure = {
                start: currentTime,
                duration: timePerMeasure,
                commands: cachedCommands,
                commandsData : cachedCommandsData,
            };
            this.measures.push(measure);
            cachedCommands = []
            cachedCommandsData = [];
            if (line.length == 0) {
                currentTime += timePerMeasure;
                continue
            }

            // handle beat
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

    play(callback) {
        this.endCallback = callback;

        this.state = {
            index: {
                measure: 0,
                beat: 0,
                balloon: 0,
            },
            beat: {
                leftDo: 0,
                rightDo: 0,
                leftKa: 0,
                rightKa: 0,
            },
            play: {
                combo: 0,
                gogoTime: false,
                balloon: false,
                drumroll: false,
                daiDrumroll: false,
                hitCount: 0,
            },
            judge: {
                ts: 0,
                result: JudgeResult.NONE,
            },
        };

        this.records = [];
    }

    end() {
        console.log('Music ended.');
        this.endCallback();
    }

    beat(key) {
        this.records.push(key);
        switch (key.value) {
            case Keys.LEFT_DO:
                this.state.beat.leftDo = key.ts;
                break;
            case Keys.RIGHT_DO:
                this.state.beat.rightDo = key.ts;
                break;
            case Keys.LEFT_KA:
                this.state.beat.leftKa = key.ts;
                break;
            case Keys.RIGHT_KA:
                this.state.beat.rightKa = key.ts;
                break;
        }
    }

    readState(deltaTime) {
        this.check(deltaTime);

        let result = {
            beat: this.state.beat,
            play: this.state.play,

            beats: [],
        };

        let stopTs = deltaTime + this.measures[this.state.index.measure].duration;
        let distancePerTime = 1 / this.measures[this.state.index.measure].duration;
        for (let i = this.state.index.beat; i < this.beats.length; i++) {
            if (this.beats[i].ts > stopTs) {
                break;
            }

            let beat = {
                distance: (this.beats[i].ts - deltaTime) * distancePerTime,
                type: this.beats[i].type
            };

            result.beats.push(beat);
        }

        return result;
    }

    check(deltaTime) {
        // check measure
        let currentMeasure = this.measures[this.state.index.measure];
        if (deltaTime > currentMeasure.start + currentMeasure.duration) {
            this.state.index.measure += 1;
            currentMeasure = this.measures[this.state.index.measure];

            if (this.state.index.measure >= this.measures.length) {
                this.end();
            }
            // TODO run measure command
        }

        // check beat
        let currentBeat = this.measures[this.state.index.beat];
        if (deltaTime >= currentBeat.ts + JudgeBias.OK) {
            this.closeBeat(this.state.index.beat);
            currentBeat = this.measures[this.state.index.beat];
        }


    }

    closeBeat(index, ts) {
        let beat = this.beats[index];
        switch (beat.type) {
            case BeatType.DO:
            case BeatType.KA:
            case BeatType.DAI_DO:
            case BeatType.DAI_KA:
                this.state.judge.result = JudgeResult.BAD;
                this.state.judge.ts = ts;
                break;
            case BeatType.DRUMROLL:
            case BeatType.DAI_DRUMROLL:
            case BeatType.BALLOON:
                break;
            case BeatType.END:
                this.state.play.balloon = false;
                this.state.play.drumroll = false;
                this.state.play.daiDrumroll = false;
                this.state.play.hitCount = 0;
                break;
        }

        this.state.index.beat += 1;
        if (this.state.index.beat >= this.beats.length) {
            this.end();
        }
    }





}
