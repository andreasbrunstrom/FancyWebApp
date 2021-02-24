var config = require('../config');
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcryptjs');
var db;

MongoClient.connect(config.mongoUrl, function (err, database) {
    if (err)
        throw err;
    db = database;
});

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;

            getUserByUsername(newUser.username, function (err, oldUser) {
                console.log(oldUser);
                if (oldUser) {
                    callback('Användarnamnet upptaget.');
                } else {
                    db.collection('users', function (err, collection) {
                        collection.insert(newUser);
                        callback('Användaren skapad.');
                    });
                }
            });
        });
    });
};

module.exports.saveUser = function (user) {
    var id = user.id;
    delete user.id;
    db.collection('users', function (err, collection) {
        collection.update({ _id: new ObjectId(id) },{$set: user});
    });
}

module.exports.getUserByUsername = getUserByUsername;
function getUserByUsername(username, callback) {
    db.collection('users', function (err, collection) {
        collection.findOne({ username: username }, callback);
    });
};
module.exports.getUserById = function (id, callback) {
    db.collection('users', function (err, collection) {
        collection.findOne(new ObjectId(id), callback);
    });
};
module.exports.comparePasswords = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err)
            throw err;
        callback(null, isMatch);
    });
};
//# sourceMappingURL=user.js.map 