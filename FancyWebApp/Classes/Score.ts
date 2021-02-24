class Score {
    judgeId: number;
    judgeSeat: number;
    points: number;

    constructor(judgeId: number, judgeSeat: number, points: number) {
        this.judgeId = judgeId;
        this.judgeSeat = judgeSeat;
        this.points = points;
    }
}

export = Score;