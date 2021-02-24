var config = require('../config');
var express = require("express");
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var db;
var views = ['index', 'contestant', 'judge', 'admin'];
var sidebars = [
    null,
    [
        {
            icon: "face",
            text: "Mitt konto",
            link: "me"
        },
        {
            seperator: true
        },
        {
            icon: "list",
            text: "Tävlingar",
            link: "competitions"
        }
    ],
    [
        {
            icon: "face",
            text: "Mitt konto",
            link: "me"
        },
        {
            seperator: true
        },
        {
            icon: 'list',
            text: 'Tävlingar',
            link: 'competitions'
        }
    ],
    [
        {
            icon: 'face',
            text: 'Mitt konto',
            link: 'me'
        },
        {
            seperator: true
        },
        {
            icon: 'list',
            text: 'Tävlingar',
            link: 'competitions',
            children: [
                {
                    icon: 'playlist_add',
                    text: 'Skapa ny',
                    link: 'competitions/new'
                }
            ]
        },
        {
            icon: 'people',
            text: 'Användare',
            link: 'users',
            children: [
                {
                    icon: 'person_add',
                    text: 'Lägg till ny',
                    link: 'users/new'
                }
            ]
        },
        {
            icon: 'settings',
            text: 'Inställningar',
            link: 'settings'
        }
    ]
];
MongoClient.connect(config.mongoUrl, function (err, database) {
    if (err)
        throw err;
    db = database;
});
passport.use(new LocalStrategy(function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            return done(null, false, { message: 'Felaktigt användarnamn eller lösenord' });
        }
        User.comparePasswords(password, user.password, function (err, isMatch) {
            if (err)
                throw err;
            if (isMatch) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: 'Felaktigt användarnamn eller lösenord' });
            }
        });
    });
}));
passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (user, done) {
    User.getUserById(user, function (err, user) {
        done(err, user);
    });
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/');
    }
}
function ensureAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.userlevel === 3) {
            return next();
        }
    }
    res.redirect('/');
}
router.get('/', function (req, res) {
    res.render("index", {
        title: "FancyDiving",
        page: 'index/start',
        sidebar: req.user ? sidebars[req.user.userlevel] : sidebars[0],
        news: [
            {
                title: 'Julklappshoppet',
                excerpt: '9-11/12 var tre av ÖSA:s simhoppare i Jönköping på tävlingen julklappshoppet. Samtliga gjorde en jättefin insats! För två av dem var det dessutom den allra första tävlingen!'
            },
            {
                title: 'Ta chansen och testa på simhopp',
                excerpt: 'Den 4/9 och 11/9 har vi prova på tillfällen för barn födda 2004-2011. '
            },
            {
                title: 'Ny grupp för nybörjare',
                excerpt: 'Nu startar vi upp en nybörjargrupp i simhopp, som kommer att träna söndagar 16:00-17:00 på Gustavsvik. Fram tom.den 23 oktober är anmälan öppen på vår hemsida, därefter får man kontakta Kathleen Berg på mail keberg2@gmail.com för förfrågningar.'
            }
        ]
    });
});
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
router.post('/login', passport.authenticate('local', { sucessRedirect: '/competitions', failureRedirect: '/' }), function (req, res) {
    //var username = req.body.username;
    //var password = req.body.password;
    //console.log(username);
    res.redirect('/competitions');
});
router.get('/me', ensureAuthenticated, function (req, res) {
    res.render(views[req.user.userlevel], {
        title: 'FancyDiving - Mitt konto',
        page: 'includes/profile',
        sidebar: sidebars[req.user.userlevel],
        userinfo: req.user
    });
});
router.get('/competitions', function (req, res) {
    var userlevel = req.user ? req.user.userlevel : 0;
    db.collection('competitions', function (err, collection) {
        collection.find().sort({ started: -1, ended: -1, date: 1 }).toArray(function (err, items) {
            if (err) {
                res.send(err);
            }
            else if (items.length) {
                res.render(views[userlevel], {
                    title: 'FancyDiving - Tävlingar',
                    page: views[userlevel] + '/competitions',
                    sidebar: sidebars[userlevel],
                    competitions: items
                });
            }
            else {
                res.send('No results');
            }
        });
    });
});
router.get('/competitions/new', ensureAdmin, function (req, res) {
    var userlevel = 3;
    res.render(views[userlevel], {
        title: 'FancyDiving - Ny tävling',
        page: views[userlevel] + '/singleCompetition',
        sidebar: sidebars[userlevel],
        competition: {
            name: 'Ny Tävling',
            _id: -1,
            date: (new Date).toISOString(),
            contestants: [],
            judges: []
        },
        jumpCodes: require('../jumpcodes.json')
    });
});
router.get('/competitions/:competitionId', function (req, res) {
    var userlevel = req.user ? req.user.userlevel : 0;
    var competitionId = req.params.competitionId;
    db.collection('competitions', function (err, collection) {
        collection.aggregate([
            { $match: { _id: new ObjectId(competitionId) } },
            {
                $unwind: {
                    path: "$judges",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'judges.userId',
                    foreignField: '_id',
                    as: 'judge'
                }
            },
            {
                $unwind: {
                    path: "$judge",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $unwind: {
                    path: "$contestants",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'contestants.userId',
                    foreignField: '_id',
                    as: 'contestant'
                }
            },
            {
                $unwind: {
                    path: "$contestant",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $sort: { 'contestant.name': -1 }
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    date: { $first: '$date' },
                    gender: { $first: '$gender' },
                    ageGroup: { $first: '$ageGroup' },
                    rounds: { $first: '$rounds' },
                    height: { $first: '$height' },
                    started: { $first: '$started' },
                    ended: { $first: '$ended' },
                    contestants: {
                        '$addToSet': {
                            userinfo: '$contestant',
                            totalscore: '$contestants.totalscore',
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
        ], function (err, items) {
            //res.json(items);
            if (err) {
                res.send(err);
            }
            else if (items.length) {
                res.render(views[userlevel], {
                    title: 'FancyDiving - ' + items[0].name,
                    page: views[userlevel] + '/singleCompetition',
                    sidebar: sidebars[userlevel],
                    competition: items[0],
                    jumpCodes: require('../jumpcodes.json')
                });
            }
            else {
                res.send('No results');
            }
        });
    });
});
router.get('/users', ensureAdmin, function (req, res) {
    db.collection('users', function (err, collection) {
        collection.find().sort({ userlevel: -1, name: 1 }).toArray(function (err, items) {
            if (err) {
                res.send(err);
            }
            else if (items.length) {
                res.render('admin', {
                    get: req,
                    title: 'FancyDiving - Användare',
                    page: 'admin/users',
                    sidebar: sidebars[req.user.userlevel],
                    users: items
                });
            }
            else {
                res.send('No results');
            }
        });
    });
});
router.get('/users/new', ensureAdmin, function (req, res) {
    var userlevel = 3;
    res.render(views[userlevel], {
        title: 'FancyDiving - Ny användare',
        page: 'admin/createProfile',
        sidebar: sidebars[userlevel]
    });
});
router.get(['/users/:userId'], ensureAdmin, function (req, res) {
    var userId = req.params.userId;
    db.collection('users', function (err, collection) {
        collection.find(new ObjectId(userId)).toArray(function (err, items) {
            if (err) {
                res.send(err);
            }
            else if (items.length) {
                res.render('admin', {
                    get: req,
                    title: 'FancyDiving - ' + items[0].username,
                    page: 'includes/profile',
                    sidebar: sidebars[req.user.userlevel],
                    userinfo: items[0]
                });
            }
            else {
                res.send('No results');
            }
        });
    });
});
router.get('/settings', ensureAdmin, function (req, res) {
    res.render('admin', {
        get: req,
        title: 'FancyDiving - ',
        page: 'admin/settings',
        sidebar: sidebars[3]
    });
});
module.exports = router;
//# sourceMappingURL=index.js.map 
//# sourceMappingURL=routes.js.map