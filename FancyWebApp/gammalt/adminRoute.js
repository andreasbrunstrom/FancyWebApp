var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var config = require('./config');
//var mongoUrl = 'mongodb://fancydiving:simhopp1234@ds059682.mlab.com:59682/fancy';
var adminSidebar = [
    {
        icon: 'face',
        text: 'Mitt konto',
        link: '/me'
    },
    {
        seperator: true
    },
    {
        icon: 'list',
        text: 'Tävlingar',
        link: '/competitions'
    },
    {
        icon: 'people',
        text: 'Användare',
        link: '/users'
    },
    {
        icon: 'settings',
        text: 'Inställningar',
        link: '/settings'
    }
];
router.get('/me', function (req, res) {
    mongoClient.connect(config.mongoUrl, function (err, db) {
        //console.log(mongoClient);
        db.collection('users', function (err, collection) {
            collection.find().toArray(function (err, items) {
                if (err) {
                    res.send(err);
                }
                else if (items.length) {
                    console.log(items);
                    res.render('admin', {
                        get: req,
                        title: 'FancyDiving - ',
                        page: 'includes/profile',
                        sidebar: adminSidebar,
                        competitions: null,
                        competition: null,
                        users: null
                    });
                }
                else {
                    res.send('No results');
                }
            });
        });
    });
});
router.get('/settings', function (req, res) {
    mongoClient.connect(config.mongoUrl, function (err, db) {
        //console.log(mongoClient);
        db.collection('settings', function (err, collection) {
            collection.find().toArray(function (err, items) {
                if (err) {
                    res.send(err);
                }
                else if (items.length) {
                    res.render('admin', {
                        title: 'FancyDiving - Settings',
                        page: 'admin/settings',
                        sidebar: adminSidebar
                    });
                }
                else {
                    res.send('No results');
                }
            });
        });
    });
});
router.get(['/', '/competitions'], function (req, res) {
    mongoClient.connect(config.mongoUrl, function (err, db) {
        //console.log(mongoClient);
        db.collection('competitions', function (err, collection) {
            collection.find().toArray(function (err, items) {
                if (err) {
                    res.send(err);
                }
                else if (items.length) {
                    res.render('admin', {
                        get: req,
                        title: 'FancyDiving - Admin',
                        page: 'admin/start',
                        sidebar: adminSidebar,
                        competitions: items,
                        competition: null
                    });
                }
                else {
                    res.send('No results');
                }
            });
        });
    });
});
router.get('/competitions/new', function (req, res) {
    res.render('admin', {
        title: 'FancyDiving - Admin',
        page: 'admin/single_competition',
        sidebar: adminSidebar,
        competition: {
            '_id': null,
            name: 'Ny tävling',
            date: new Date().toJSON()
        }
    });
});
router.get('/competitions/:competitionId', function (req, res) {
    var competitionId = req.params.competitionId;
    mongoClient.connect(config.mongoUrl, function (err, db) {
        db.collection('competitions', function (err, collection) {
            collection.aggregate([
                { $match: { _id: new ObjectId(competitionId) } },
                { $unwind: '$judges' },
                { $lookup: {
                        from: 'users',
                        localField: 'judges.userId',
                        foreignField: '_id',
                        as: 'judge'
                    }
                },
                { $unwind: '$judge' },
                { $unwind: '$contestants' },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'contestants.userId',
                        foreignField: '_id',
                        as: 'contestant'
                    }
                },
                { $unwind: '$contestant' },
                {
                    $group: {
                        _id: '$_id',
                        name: { $first: '$name' },
                        date: { $first: '$date' },
                        gender: { $first: '$gender' },
                        ageGroup: { $first: '$ageGroup' },
                        rounds: { $first: '$rounds' },
                        height: { $first: '$height' },
                        contestants: {
                            '$addToSet': {
                                userinfo: '$contestant',
                                totalScore: '$contestants.totalScore',
                                jumps: '$contestants.jumps'
                            }
                        },
                        judges: {
                            '$addToSet': {
                                userinfo: '$judge'
                            }
                        }
                    }
                }
            ], function (err, data) {
                //res.json(data);
                if (err) {
                    res.send(err);
                }
                else if (data.length) {
                    res.render('admin', {
                        title: 'FancyDiving - Admin',
                        page: 'admin/single_competition',
                        sidebar: adminSidebar,
                        competition: data[0]
                    });
                }
                else {
                    res.send('No results');
                }
            });
        });
    });
});
router.get('/users', function (req, res) {
    mongoClient.connect(config.mongoUrl, function (err, db) {
        //console.log(mongoClient);
        db.collection('users', function (err, collection) {
            collection.find().sort({ userlevel: -1, name: 1 }).toArray(function (err, items) {
                if (err) {
                    res.send(err);
                }
                else if (items.length) {
                    res.render('admin', {
                        get: req,
                        title: 'FancyDiving - Admin',
                        page: 'admin/users',
                        sidebar: adminSidebar,
                        competitions: null,
                        competition: null,
                        users: items
                    });
                }
                else {
                    res.send('No results');
                }
            });
        });
    });
});
router.get(['/users/:userId'], function (req, res) {
    var userId = req.params.userId;
    mongoClient.connect(config.mongoUrl, function (err, db) {
        db.collection('users', function (err, collection) {
            collection.find(new ObjectId(userId)).toArray(function (err, items) {
                if (err) {
                    res.send(err);
                }
                else if (items.length) {
                    res.render('admin', {
                        get: req,
                        title: 'FancyDiving - ',
                        page: 'admin/userSettings',
                        sidebar: adminSidebar,
                        user: items[0]
                    });
                }
                else {
                    res.send('No results');
                }
            });
        });
    });
});
module.exports = router;
//# sourceMappingURL=adminRoute.js.map