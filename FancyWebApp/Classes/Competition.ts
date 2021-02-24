import judge = require("./Judge");
import jump = require("./Jump");
import contestant = require("./Contestant");
//import mongodb = require('mongodb');
//var Question = require('mongodb').Question;
//var Promise = require('mongodb').promise;


class Competition {
    id: number;
    name: string;
    gender: number;
    syncro: boolean;
    height: number;
    date: Date;
    ageGroup: string;
    judges: Array<judge>;
    contestants: Array<contestant>;
    rounds: number;

    currentContestantIndex = 0;
    currentRound = 0;
    currentJump: jump;

    started = false;
    finished = false;
    highscore: Array<contestant>;
    jumpsInCompetition: Array<jump>;

    constructor(name: string, gender: number, syncro: boolean, hight: number, date: Date, ageGroup: string, rounds: number) {
        this.name = name;
        this.gender = gender;
        this.syncro = syncro;
        this.height = hight;
        this.date = date;
        this.ageGroup = ageGroup;
        this.rounds = rounds;
    }

    goToNextJump() {
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
    }

    //fetchCompetition(permission, params) { 
    //    return new Promise((resolve, reject) => {
    //        let query = Question.aggregate([
    //        /**
    //         *  We need to perform a lookup on the author 
    //         *  so we can include the user details for the 
    //         *  question. This lookup is quite easy to handle 
    //         *  because a question should only have one author.
    //         */
    //        {
    //            $lookup: {
    //                from: 'users',
    //                localField: 'userId',
    //                foreignField: '_id',
    //                as: 'userObject'
    //            }
    //        },
    //        /**
    //         *  We need this so that the lookup on the author
    //         *  object pulls out an author object and not an
    //         *  array containing one author. This simplifies
    //         *  the process of $project below.
    //         */
    //        {
    //            $unwind: '$userObject'
    //        },
    //        /**
    //         *  The next stage of the aggregation pipeline takes all 
    //         *  the duplicated questions with their flags and the flagObjects
    //         *  and normalises the data. The $group aggregator requires an _id
    //         *  property to describe how a question should be unique. It also sets
    //         *  up some variables that can be used when it comes to the $project
    //         *  stage of the aggregation pipeline.
    //         *  the flagObjects property calls on the $push function to add a collection
    //         *  of flagObjects that were pulled from the $lookup above.
    //         */
    //        {
    //            $group: {
    //                _id: {
    //                    _id: '$_id',
    //                    title: '$title',
    //                    content: '$content',
    //                    updated: '$updated',
    //                    isPublished: '$isPublished',
    //                    isFeatured: '$isFeatured',
    //                    isAnswered: '$isAnswered',
    //                    answers: '$answers',
    //                    user: '$userObject'
    //                }
    //            }
    //        },
    //        /**
    //         *  The $project stage of the pipeline then puts together what the final 
    //         *  result set should look like when the query is executed. Here we can use
    //         *  various Mongo functions to reshape the data and create new attributes.
    //         */
    //        {
    //            $project: {
    //                //_id: 0,
    //                _id: '$_id._id',
    //                name: '$_id.title',
    //                date: '$_id.updated',
    //                author: {
    //                    fullname: '$_id.author.fullname',
    //                    username: '$_id.author.username'
    //                }
    //            }
    //        },
    //        /**
    //         *  Then we can sort, skip and limit if needs be.
    //         */
    //        {
    //            $sort: {
    //                updated: -1
    //            }
    //        },
    //        {
    //            $skip: 0
    //        },
    //        // {
    //        //     $limit: 110
    //        // }
    //    ]);

    //        query.exec((error, result) => {
    //        if (error) reject(error);
    //        else resolve(result);
    //        });
    //    });
    //}
}

export = Competition;