"use strict";
var Judge = (function () {
    function Judge(id, name, nationality, seat) {
        this.id = id;
        this.time = new Date().getTime();
        this.name = name;
        this.nationality = nationality;
        this.seat = seat;
    }
    Judge.prototype.updateTime = function () {
        this.time = new Date().getTime();
    };
    Judge.prototype.displayNameNationality = function () {
        return this.name + ", " + this.nationality;
    };
    return Judge;
}());
module.exports = Judge;
//# sourceMappingURL=Judge.js.map