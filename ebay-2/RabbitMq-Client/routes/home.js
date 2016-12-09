var ejs = require("ejs");
//var mongo = require("./mongo");
//var mongoURL = "mongodb://localhost:27017/ebay";
var mq_client = require('../rpc/client');

var win_logger = require('winston');
var bcrypt = require('./bCrypt.js')
// to validate  the login user signin function 
//var hash = bcrypt.hashSync(password);
var crypto = require('crypto'), // for encryption
    algorithm = 'aes-256-ctr',
    password = 'test123';

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

//
exports.checksignin = function (req, res) {


    var username = req.param('username');
    console.log(username);
    var password1 = req.param('password');
    var password = encrypt("password1");
    var msg_payload = {"username": username, "password": password};
    console.log("In POST Request = UserName:" + username + " and Password: " + password);
    mq_client.make_request('login_queue', msg_payload, function (err, results) {
        console.log("MMMM" + results);
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {
                //assigning the session
                console.log("SAHIL UUU");
                //console.log(results.time1);
                req.session.email = results.email;
                console.log(req.session.email);
                req.session.username = username;
                console.log("dhsjd" + req.session.username);
                req.session.date = results.date1;
                console.log("dhsjd" + req.session.date);
                req.session.time = results.time1;
                console.log("dhsjd" + req.session.time);

                req.session.firstname = results.firstname;
                console.log(req.session.firstname);
                req.session.lastname = results.lastname;
                console.log(req.session.lastname);
                console.log("session is assigned to: " + req.session.username);
                console.log("valid Login " + results.code);
                win_logger.log('info', 'user - ' + req.session.username + ' - successfully in login');
                res.send({"login": "Success", "username": username});
            }
            else {
                console.log("Invalid Login" + results.code);
                win_logger.log('info', 'user - ' + username + ' - unsuccessfully in login');
                res.send({"login": "Fail"});
            }
        }
    });
}; // end of the function of signin


exports.signin = function (req, res) {
    res.render('signin');
};


//HomePage redirection

//Redirects to the homepage
exports.redirectToHomepage = function (req, res) {
    console.log(" I m here");

    //Checks before redirecting whether the session is valid
    console.log(req.session.username);
    if (req.session.username) {
        win_logger.log('info', 'user - ' + req.session.username + ' - redirect to homepage');
        //Set these headers to notify the browser not to maintain any cache for the page being loaded
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("homepage", {
            username: req.session.username,
            firstname: req.session.firstname,
            lastname: req.session.lastname,
            date: req.session.date,
            time: req.session.time
        });

    }
    else {
        res.redirect('/signin');
    }
};

//signup success
exports.success = function (req, res) {
    console.log(" I m signup");


    res.render("success", {username: req.session.username, firstname: req.session.firstname});


};


//

//signup failure
exports.exists = function (req, res) {
    console.log(" I already exist");


    res.render("exists", {email: req.session.email, firstname: req.session.firstname});


};

//
//Logout the user - invalidate the session
exports.logout = function (req, res) {
    req.session.destroy();
    console.log ( "Username --> Undefined");
    console.log("session username" + " -->  " + " " + "undefined");
    res.render("signout");
};


//Signup

exports.signup = function (req, res) {

    ejs.renderFile('./views/signup.ejs', function (err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
};

// sign up validation
exports.afterSignUp = function (req, res) {
    // check user already exists

    var first = req.param("firstname");
    var last = req.param("lastname");
    var email = req.param("email");
    var json_responses;
    var password = req.param("password");
    var phone = req.param("phone");

    var msg_payload = {"first": first, "last": last, "email": email, "password": password, "phone": phone};

    console.log("In POST Request for signup =:" +  " Password:" + password +
        "firstname:" + first + " lastname:" + last + " email:" + email
        + " phone:" + phone);

    win_logger.log('info', 'user - signup -UserName:"' + '" Password:"' + password +
        '"firstname:"' + first + '" lastname:"' + last + '" email:"' + email
        + '" phone:"' + phone);

    mq_client.make_request('signup_queue', msg_payload, function (err, results) {
        console.log(results);
        if (err) {
            throw err;
        }
        else {
            if (results.code == 401) {
                console.log(results.code);
                req.session.email = results.email;
                console.log("asds"+ req.session.email);

                req.session.firstname = results.firstname;
                console.log("asds"+ req.session.firstname);
                res.send({"signup": "fail"});

            }
            else if (results.code == 200) {
                req.session.username = results.username;
                console.log("asds"+ req.session.username);

                req.session.firstname = results.firstname;
                console.log("asds"+ req.session.firstname);
                console.log("XXX");
                console.log("XXX" + results.code);
                //console.log(results.code + ":" + results.value);

                res.send({"signup": "success"});
            }
        }
    });
}


	
