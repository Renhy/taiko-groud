import { httpGet } from "./utils.js";

export var NoteType = {
    DO: 1,
    KA: 2,
    DAI_DO: 3,
    DAI_KA: 4,
    DRUMROLL: 5,
    DAI_DRUMROLL: 6,
    BALLOON: 7,
    END: 8,
};

export var CourseType = {
    EASY: 'Easy',
    NORMAL: 'Normal',
    HARD: 'Hard',
    EXTREME: 'Oni',
    EXTRA: 'Edit',
};

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

        this.courses = [];
        this.parse(lines);
        this.a =1;
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
                type = line.slice(line.indexOf(':')).trim();
                current = [];
            }
            if (line.indexOf('#END') >= 0) {
                this.courses[type] = new Course(current);
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
        if (line.indexOf('bpm') >= 0) {
            let bpm = line.slice(line.indexOf(':') + 1).trim();
            this.metaData.subTitle = parseFloat(bpm);
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


}

class Course {
    constructor(lines) {

    }

}
