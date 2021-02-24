var config = require('./config');
var socketio = require('socket.io');
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var User = require('./models/user');
var jumpCodes = require('./jumpcodes.json');
/// <reference path = "./Classes/Competition.js"/>
var db;
MongoClient.connect(config.mongoUrl, function (err, database) {
    if (err)
        throw err;
    db = database;
});
var competitionList = {};
var scoreList = {};
module.exports.listen = function (app) {
    io = socketio.listen(app);
    //users = io.of('/users')
    io.on('connection', function (socket) {
        socket.on('competitionDelete', function (id) {
            db.collection('competitions', function (err, collection) {
                if (err) {
                    console.log(err);
                }
                else {
                    collection.remove({ _id: new ObjectId(id) }, function (err, comp) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            socket.emit('toast', 'Tävlingen borttagen.');
                        }
                    });
                }
            });
        });
        socket.on('competitionSave', function (comp) {
            var competition = JSON.parse(comp);
            competition.judges.forEach(function (judge, index) {
                competition.judges[index]["userId"] = new ObjectId(judge["userId"]);
            });
            competition.contestants.forEach(function (contestant, index) {
                competition.contestants[index]["userId"] = new ObjectId(contestant["userId"]);
            });
            db.collection('competitions', function (err, collection) {
                if (err) {
                    console.log(err);
                }
                var competitionId = competition.id;
                delete competition.id;
                if (competitionId == -1) {
                    collection.insert(competition, function (err, newDoc) {
                        //console.log(newDoc);
                        socket.emit('changeUrl', '/competitions/' + newDoc.insertedIds);
                    });
                }
                else {
                    collection.update({ '_id': new ObjectId(competitionId) }, {
                        $set: competition
                    });
                }
                socket.emit('toast', 'Tävlingen sparad.');
            });
        });

        socket.on('competitionReset', function (id) {
            db.collection('competitions', function (err, collection) {
                if (err) {
                    console.log(err);
                }
                else {
                    //collection.update({ '_id': new ObjectId(id) }, {
                    //    "$set": { ended: false, started: false, currentRound: 0 }
                    //});
                    collection.find({ '_id': new ObjectId(id) }).forEach(function (competition) {
                        competition.ended = false;
                        competition.started = false;
                        competition.currentRound = 0;
                        competition.currentContestant = 0;
                        competition.contestants.forEach(function (contestant) {
                            contestant.totalscore = '';
                            contestant.jumps.forEach(function (jump) {
                                jump.jumpScore = '';
                            });
                        });
                        collection.save(competition);
                    });
                    socket.emit('competitionResetDone', '');
                }
            });
        });

        socket.on('competitionStart', function (id) {
            //console.log("start");
            id = JSON.parse(id);
            db.collection('competitions', function (err, collection) {
                if (err) {
                    console.log(err);
                }
                else {
                    collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { "started": true } }, { returnOriginal: false }, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            var c = result.value;
                            if (c.height == 0) {
                                c.height = 1;
                            }
                            if (typeof c.currentRound == 'undefined') {
                                c.currentRound = 0;
                            }
                            if (typeof c.currentContestant == 'undefined') {
                                c.currentContestant = 0;
                            }
                            competitionList[String(c._id)] = c;
                            scoreList[String(c._id)] = [];
                            socket.emit('toast', 'Tävlingen startad.');
                            //console.log(competitionList);
                            //console.log(competitionList[0]._id);
                        }
                    });
                }
            });
            socket.join(id);
            //console.log("end");
        });
        // Event fÃƒÂ¶r domare att joina en tÃƒÂ¤vling
        socket.on('competitionJoin', function (id) {
            id = JSON.parse(id);
            socket.join(id);
        });
        socket.on('nextJump', function (id) {
            var c = competitionList[String(id)];
            //var compID = String(c._id);
            io.sockets.to(id).emit('nextContestant', c.contestants[c.currentContestant], c.currentRound);
        });
        socket.on('scoreSent', function (inScore) {
            //console.log(inScore);
            var score = JSON.parse(inScore);
            var c = competitionList[score.competitionId];
            //console.log("Test i scoresent in score ", score.points);
            //  for (i = 0; i < copmpetitionList[0][0].judges[0].length; i++ )
            if (scoreList[String(c._id)].length < c.judges.length) {
                scoreList[String(c._id)].push(score.points);
            }
            if (scoreList[String(c._id)].length == (c.judges.length)) {
                //for (j = 0; j < scoreList.length; j++)
                calculateJumpScore(scoreList[String(c._id)], c, function (sum) {
                    //console.log(scoreList);
                    scoreList[String(c._id)] = [];

                    c.contestants[c.currentContestant].jumps[c.currentRound].jumpScore = sum;
                    if (c.currentContestant < c.contestants.length) {
                        c.currentContestant++;
                        //console.log('ContestantIndex = ' + c.currentContestant);
                    }
                    if (c.currentContestant == c.contestants.length) {
                        c.currentContestant = 0;
                        if (c.currentRound < c.rounds) {
                            c.currentRound++;
                        }
                    }
                    if (c.currentRound == c.rounds) {
                        var compID = String(c._id);
                        io.sockets.to(compID).emit('competitionEnded');
                        delete competitionList[compID];
                        db.collection('competitions', function (err, collection) {
                            collection.update({ _id: new ObjectId(compID) }, { $set: { started: false, ended: true } });
                        });
                    }
                });               
            }
            //db.collection('competitions', function (err, collection) {
            //    //collection.findOne().toArray(function (err, competition) {
            //    //    collection.update({ _id: score.competitionId }, {
            //    //        //competition.contestants[competition.currentContestantIndex].jumps[comptetition.currentRound];
            //    //        $push: { "contestants[competition.currentContestantIndex]": { "judgeSeat": score.judgeSeat, "points": score.points } }
            //    //    })
            //    //});
            //    collection.update({ '_id': new ObjectId(score.competitionId), "contestants.userId": score.contestantId }, {
            //        "$push": {
            //            "contestants.$.jumps": {
            //                "judgeSeat": score.judgeSeat,
            //                "points": score.points
            //            }
            //        }
            //    });
            //});
            //console.log("Score: ", score);
            //io.sockets.to(id).emit('score', score);
        });
        function calculateJumpScore(scores, c, callback) {;
            var _scores = scores;
            var jumpScore = 0;
            if ((_scores.length == 3) || (_scores.length == 5) || (_scores.length == 7)) {
                _scores.sort(function (a, b) { return a.points - b.points; }); //sort 0-"number of scores" by points
                while(_scores.length > 3) {
                    _scores.pop();
                    _scores.shift();
                }
                var jumpCode = c.contestants[c.currentContestant].jumps[c.currentRound].jumpCode;

                var difficulty = jumpCodes[jumpCode]["DD"][c.height];

                var sum = _scores.reduce(function (pv, cv) { return pv + cv; }, 0);
                sum = Number(sum);
                jumpScore = (sum * difficulty);
                var queryString = "contestants." + c.currentContestant + '.jumps.' + c.currentRound + '.jumpScore';

                var set = {
                    currentRound: c.currentRound,
                    currentContestant: c.currentContestant
                };
                set[queryString] = jumpScore;
                var inc = {};
                inc["contestants." + c.currentContestant + ".totalscore"] = jumpScore;

                db.collection('competitions', function (err, collection) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        collection.update({ '_id': new ObjectId(c._id) }, {
                            "$set": set,
                            "$inc": inc
                        });
                        io.sockets.emit('completedJump', { round: c.currentRound, contestantindex: c.currentContestant, compId: c._id, jumpScore: jumpScore, contestant: c.contestants[c.currentContestant].userId });
                    }
                });
                //return jumpScore;
            }
            callback(jumpScore);
        }
        socket.on('userSave', function (user) {
            user = JSON.parse(user);
            if (user.userlevel) {
                user.userlevel = Number(user.userlevel);
            }
            if (user.gender) {
                user.gender = Number(user.gender);
            }
            User.saveUser(user);
            socket.emit('toast', 'Ändringar sparade.');
            //console.log(user);
        });
        socket.on('userCreate', function (user) {
            user = JSON.parse(user);
            if (user.userlevel) {
                user.userlevel = Number(user.userlevel);
            }
            else {
                user.userlevel = 1;
            }
            if (user.gender) {
                user.gender = Number(user.gender);
            }
            delete user.repeatPassword;
            User.createUser(user, function (message) {
                socket.emit('toast', message);
            });
        });
        socket.on('userChangePassword', function (data) {
            //console.log(user);
            socket.emit('toast', 'Lösenord ej ändrat, ej implementerat än!');
        });

        socket.on('getUserlist', function (data) {
            var data = JSON.parse(data);
            db.collection('users', function (err, collection) {
                collection.find({ 'userlevel': data.userlevel }, { name: 1 }).toArray(function (err, items) {
                    //console.log(items);
                    if (err)
                        throw err;
                    socket.emit('userlist', JSON.stringify(items, null, ' '));
                });
            });
        });
    });
    return io;
};
//# sourceMappingURL=sockets.js.map    