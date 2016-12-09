var crypto = require('crypto');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("./mongo");
var connectServer = "mongodb://localhost:27017/ebay";

module.exports = function(passport) {
    passport.use('checksignin1', new LocalStrategy(function (username, password, done) {

        console.log("Sahil Kaw");
        var password = bcrypt.hashSync(password);
        //var encryptPassword = crypto.createHash("md5").update(password).digest('hex');

        mongo.connect(connectServer, function (connection) {

            var collxn = mongo.collection('users', connection);
            var whereParams = {
                username: username,
                password: password
            };

            process.nextTick(function () {
                collxn.findOne(whereParams, function (error, user) {
                    if (user) {
                        var result = {"status": "200"};
                    } else {
                        var result = {"status": "401", "msg": "Either email or password is incorrect"};
                    }
                    done(null, result);
                });
            });
        });
    }))
};



