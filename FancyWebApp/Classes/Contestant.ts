import jump = require("./Jump");

class Contestant {
    id: number;
    name: string;
    club: string;
    nationality: string;
    gender: boolean;
    birthdate: Date;
    totalScore: number;
    jumpList: Array<jump>;

    constructor(id: number, name: string, club: string, nationality: string, gender: boolean, birthdate: Date) {
        this.id = id;
        this.name = name;
        this.club = club;
        this.nationality = nationality;
        this.birthdate = birthdate;
    }

    calculateTotalScore() {
        this.totalScore = 0;
        for (let i of this.jumpList) {
            this.totalScore += i.jumpScore;
        }
    }
}

export = Contestant;