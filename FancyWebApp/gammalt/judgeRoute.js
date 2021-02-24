var express = require("express");
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var config = require('./config');
//var url = 'mongodb://fancydiving:simhopp1234@ds059682.mlab.com:59682/fancy';
var judgeSidebar = [
    {
        icon: "face",
        text: "Mitt konto",
        link: "/judge/me"
    }
];
/* GET home page. */
//router.get('/', function (req, res) {
//    res.render("judge",
//        {
//            title: "FancyDiving - Domare",
//            sidebar: judgeSidebar,
//            page: 'judge/start'
//        });
//});
router.get('/me', function (req, res) {
    res.render("judge", {
        title: "FancyDiving - Domare",
        sidebar: judgeSidebar,
        page: 'includes/profile'
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
                    res.render("judge", {
                        get: req,
                        title: "FancyDiving - Domare",
                        page: "judge/start",
                        sidebar: judgeSidebar,
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
router.get(['/competitions/:competitionId', '/competitions/new'], function (req, res) {
    var competitionId = req.params.competitionId;
    mongoClient.connect(config.mongoUrl, function (err, db) {
        db.collection('competitions', function (err, collection) {
            collection.find(new ObjectId(competitionId)).toArray(function (err, items) {
                if (err) {
                    res.send(err);
                }
                else if (items.length) {
                    res.render("judge", {
                        get: req,
                        title: "FancyDiving - Domare",
                        page: "judge/judgeCompetition",
                        sidebar: judgeSidebar,
                        competitions: null,
                        competition: items[0]
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
//# sourceMappingURL=judgeRoute.js.map