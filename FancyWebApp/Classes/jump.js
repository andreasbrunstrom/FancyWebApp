"use strict";
var Jump = (function () {
    function Jump(id, height, sync, jumpcode) {
        if (jumpcode === void 0) { jumpcode = ""; }
        this.id = id;
        this.height = height;
        this.sync = sync;
        this.jumpCode = jumpcode;
        this.jumpScore = null;
        this.difficulty = null; // fixa difficulty från databas här??
        this.scores = null;
    }
    Jump.prototype.calculateJumpScores = function () {
        var _scores = this.scores;
        if (!this.sync) {
            if ((_scores.length == 3) || (_scores.length == 5) || (_scores.length == 7)) {
                _scores.sort(function (a, b) { return a.points - b.points; }); //sort 0-"number of scores" by points
                for (var i = 0; _scores.length > 3; i++) {
                    _scores.pop();
                    _scores.shift();
                }
                var sum = _scores.reduce(function (pv, cv) { return pv + cv.points; }, 0);
                this.jumpScore = (sum * this.difficulty);
                return this.jumpScore;
            }
        }
    };
    return Jump;
}());
module.exports = Jump;
//# sourceMappingURL=Jump.js.map