"use strict";
//import mongodb = require('mongodb');
//var Question = require('mongodb').Question;
//var Promise = require('mongodb').promise;
var Competition = (function () {
    function Competition(name, gender, syncro, hight, date, ageGroup, rounds) {
        this.currentContestantIndex = 0;
        this.currentRound = 0;
        this.started = false;
        this.finished = false;
        this.name = name;
        this.gender = gender;
        this.syncro = syncro;
        this.height = hight;
        this.date = date;
        this.ageGroup = ageGroup;
        this.rounds = rounds;
    }
    Competition.prototype.goToNextJump = function () {
        this.currentContestantIndex++;
        if (this.currentContestantIndex > this.contestants.length - 1) {
            this.currentContestantIndex = 0;
            this.currentRound++;
            if (this.currentRound > this.rounds - 1) {
                this.finished = true;
                this.started = false;
                this.currentRound = 0;
                this.currentContestantIndex = 0;
            }
        }
    };
    return Competition;
}());
module.exports = Competition;
//# sourceMappingURL=Competition.js.map