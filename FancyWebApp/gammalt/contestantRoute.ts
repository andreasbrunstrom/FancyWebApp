var express = require("express");
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var mongoUrl = 'mongodb://fancydiving:simhopp1234@ds059682.mlab.com:59682/fancy';

var contestantSidebar = [
    {
        icon: "face",
        text: "Mitt konto",
        link: "/me"
    },
    {
        seperator: true
    },
    {
        icon: "list",
        text: "Tävlingar",
        link: "/competitions"
    }
];

var user = {
    name: "Anton",
    mail: "blahblah@shitmail.com",
    telefon: "019-145545",
    club: "ÖSA"
};

// GET contestant page

router.get(['/','/competitions'], (req, res) => {

    mongoClient.connect(mongoUrl, function (err, db) {
        //console.log(mongoClient);
        db.collection('competitions', function (err, collection) {

            collection.find().toArray(function (err, items) {
                if (err) {
                    res.send(err);
                }
                else if (items.length) {
                    res.render("contestant",
                        {
                            get: req,
                            title: "FancyDiving - Admin",
                            page: "contestant/start",
                            sidebar: contestantSidebar,
                            competitions: items,
                        });
                }
                else {
                    res.send('No results');
                }
            });

        });

    });

});

router.get(['/competitions/:competitionId', '/competitions/new'], function(req, res) {

        var competitionId = req.params.competitionId;

        mongoClient.connect(mongoUrl, function(err, db) {

                db.collection('competitions',function(err, collection) {

                    collection.find().toArray(function (err, data) {
                        if (err) {
                            res.send(err);
                        }
                        else if (data.length) {
                            console.log(data[0].contestants);
                            res.render("admin",
                                {
                                    title: "FancyDiving - Admin",
                                    page: "contestant/contestantCompetition",
                                    sidebar: contestantSidebar,
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

router.get('/me', (req, res) => {
    res.render("contestant",
        {
            title: "FancyDiving - Deltagare",
            sidebar: contestantSidebar,
            page: "includes/profile",
            registerToNewCompetition: {
                comp1: {
                    name: "ÖSA 2020",
                    date: "2020-04-20",
                    gender: "Male"
                }
            },
            registeredTo: {
                regComp: {
                    name: "ÖSA 2021",
                    date: "2021-01-21",
                    gender: "Male",

                }
            },
            user: user
        });
});

module.exports = router;