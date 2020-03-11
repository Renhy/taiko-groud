export var BeatType = {
    DO: 1,
    KA: 2,
    DAI_DO: 3,
    DAI_KA: 4,
    DRUMROLL: 5,
    DAI_DRUMROLL: 6,
    BALLOON: 7,
    END: 8,
};

export var BeatMap = {
    '1': BeatType.DO,
    '2': BeatType.KA,
    '3': BeatType.DAI_DO,
    '4': BeatType.DAI_KA,
    '5': BeatType.DRUMROLL,
    '6': BeatType.DAI_DRUMROLL,
    '7': BeatType.BALLOON,
    '8': BeatType.END,
};

export var CourseType = {
    EASY: 'Easy',
    NORMAL: 'Normal',
    HARD: 'Hard',
    EXTREME: 'Oni',
    EXTRA: 'Edit',
};

export var JudgeResult = {
    OK: 1,
    GOOD: 2,
    BAD: 3,
    NONE: 4,
}

export var JudgeBias = {
    GOOD: 25,
    OK: 75,
};