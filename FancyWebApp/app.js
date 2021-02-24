/// <reference path = "./Classes/Competition.js"/>
/// <reference path = "./Classes/Contestant.js"/>
/// <reference path = "./Classes/Judge.js"/>
/// <reference path = "./Classes/jump.js"/>
/// <reference path = "./Classes/Score.js"/>
// Required
var config = require('./config');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var mongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
// Routes
//var routes = require('./routes/index');
//var judge = require('./routes/judgeRoute');
//var admin = require('./routes/adminRoute');
//var contestant = require('./routes/contestantRoute');
var routes = require('./routes/routes');
// Init App
var app = express();
// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(favicon(__dirname + '/public/favicon.ico'));
// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
// Express Session
app.use(session({
    secret: 'hemilighet',
    saveUninitialized: true,
    resave: true
}));
// Passport init
app.use(passport.initialize());
app.use(passport.session());
// Global variables
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});
app.use(function (req, res, next) {
    res.locals.active = req.path.split('/')[1]; // [0] will be empty since routes start with '/'
    next();
});
// Use Routes
//app.use('/', routes);
//app.use('/index', routes);
//app.use('/judge', judge);
//app.use('/admin', admin);
//app.use('/contestant', contestant);
app.use('/', routes);
// Set port and logger
app.set('port', 9000);
app.use(logger('dev'));
// SocketIO
var http = require('http').createServer(app);
http.listen(8080);
var io = require('./sockets').listen(http);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            status: err.status,
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        status: err.status,
        message: err.message,
        error: {}
    });
});
module.exports = app;
//# sourceMappingURL=app.js.map   
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map