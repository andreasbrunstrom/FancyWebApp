"use strict";
var Contestant = (function () {
    function Contestant(id, name, club, nationality, gender, birthdate) {
        this.id = id;
        this.name = name;
        this.club = club;
        this.nationality = nationality;
        this.birthdate = birthdate;
    }
    Contestant.prototype.calculateTotalScore = function () {
        this.totalScore = 0;
        for (var _i = 0, _a = this.jumpList; _i < _a.length; _i++) {
            var i = _a[_i];
            this.totalScore += i.jumpScore;
        }
    };
    return Contestant;
}());
module.exports = Contestant;
//# sourceMappingURL=Contestant.js.map