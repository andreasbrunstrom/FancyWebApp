import score = require("./Score");

class Jump {
    id: number;
    height: number;
    sync: boolean;
    jumpScore: number;
    difficulty: number;
    jumpCode: string;
    scores: Array<score>;

    constructor(id: number, height: number, sync: boolean, jumpcode: string = "") {
        this.id = id;
        this.height = height;
        this.sync = sync;
        this.jumpCode = jumpcode;
        this.jumpScore = null;
        this.difficulty = null; // fixa difficulty från databas här??
        this.scores = null;
    }

    calculateJumpScores() {

        var _scores = this.scores;

        if (!this.sync) {
            if ((_scores.length == 3) || (_scores.length == 5) || (_scores.length == 7)) {
                _scores.sort(function (a, b) { return a.points - b.points });           //sort 0-"number of scores" by points
                for (var i = 0; _scores.length > 3; i++) {
                    _scores.pop();
                    _scores.shift();
                }
                var sum = _scores.reduce(function (pv, cv) { return pv + cv.points; }, 0);
                this.jumpScore = (sum * this.difficulty);

                return this.jumpScore;
            }
            // Do stuff here
        }
    }
}
export = Jump;
