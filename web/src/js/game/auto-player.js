import { BeatType } from "./constant.js";
import { Keys } from "../keyboard.js";


export class AutoPlayer {
    constructor(game) {
        this.game = game;

        this.rollIndex = 0;

        // 0 = left
        // 1 = right
        this.hand = 1;
    }

    play(delta) {
        let beat = this.game.referee.music.beats[this.game.referee.index.beat];
        if (beat === undefined) {
            return;
        }

        if (this.game.referee.state.play.balloon ||
            this.game.referee.state.play.drumroll ||
            this.game.referee.state.play.daiDrumroll) {
            this.rollIndex += 1;
            if (this.rollIndex >= 6) {
                this.roll(delta);
                this.rollIndex = 0;
            }
            return;
        }

        if (delta < beat.ts) {
            return;
        }

        switch (beat.type) {
            case BeatType.DO:
                this.do(beat.ts);
                break;
            case BeatType.KA:
                this.ka(beat.ts);
                break;
            case BeatType.DAI_DO:
                this.do(beat.ts);
                this.do(beat.ts);
                break;
            case BeatType.DAI_KA:
                this.ka(beat.ts);
                this.ka(beat.ts);
                break;
        }

    }

    roll(ts) {
        this.do(ts);
    }

    do(ts) {
        if (this.hand == 0) {
            this.game.handle({
                value: Keys.LEFT_DO,
                ts: ts + this.game.startTime,
            });
            this.hand = 1;
        } else {
            this.game.handle({
                value: Keys.RIGHT_DO,
                ts: ts + this.game.startTime,
            });
            this.hand = 0;
        }
    }
    ka(ts) {
        if (this.hand == 0) {
            this.game.handle({
                value: Keys.LEFT_KA,
                ts: ts + this.game.startTime,
            });
            this.hand = 1;
        } else {
            this.game.handle({
                value: Keys.RIGHT_KA,
                ts: ts + this.game.startTime,
            });
            this.hand = 0;
        }
    }

}

