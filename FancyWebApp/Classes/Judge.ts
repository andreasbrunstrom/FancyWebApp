class Judge {
    id: number;
    time: number;
    name: string;
    nationality: string;
    seat: number;

    constructor(id: number, name: string, nationality: string, seat: number) {
        this.id = id;
        this.time = new Date().getTime();
        this.name = name;
        this.nationality = nationality;
        this.seat = seat;
    }

    updateTime() {
        this.time = new Date().getTime();
    }

    displayNameNationality() {
        return this.name + ", " + this.nationality;
    }
}

export = Judge;