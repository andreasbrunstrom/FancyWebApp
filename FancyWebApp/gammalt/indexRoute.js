var express = require("express");
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');
passport.use(new localStrategy(function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            console.log('okÃƒÂ¤nd anvÃƒÂ¤ndare');
            return done(null, false, { message: 'OkÃƒÂ¤nd anvÃƒÂ¤ndare' });
        }
        User.comparePasswords(password, user.password, function (err, isMatch) {
            if (err)
                throw err;
            if (isMatch) {
                console.log('inloggad');
                return done(null, user);
            }
            else {
                console.log('fel lÃƒÂ¶sen');
                return done(null, false, { message: 'Felaktigt lÃƒÂ¶senord' });
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
router.get('/', function (req, res) {
    res.render("index", { title: "FancyDiving" });
});
router.get('/logout', function (req, res) {
    req.logout();
    console.log('du har loggats ut');
    res.redirect('/');
});
router.post('/login', passport.authenticate('local', { sucessRedirect: '/competitions', failureRedirect: '/' }), function (req, res) {
    //var username = req.body.username;
    //var password = req.body.password;
    //console.log(username);
    res.redirect('/competitions');
});
module.exports = router;
//# sourceMappingURL=index.js.map 
//# sourceMappingURL=index.js.map 
//# sourceMappingURL=index.js.map 
//# sourceMappingURL=index.js.map 
//# sourceMappingURL=index.js.map 
//# sourceMappingURL=index.js.map 
//# sourceMappingURL=index.js.map 
//# sourceMappingURL=index.js.map 
//# sourceMappingURL=index.js.map 
//# sourceMappingURL=index.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map 
//# sourceMappingURL=indexRoute.js.map