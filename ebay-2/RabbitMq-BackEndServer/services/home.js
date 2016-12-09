var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var md5 = require('md5');


var win_logger = require('winston');
// to validate  the login user signin function 
//
var crypto = require('crypto'), // for encryption
algorithm = 'aes-256-ctr',
password = 'test123';

function encrypt(text){
var cipher = crypto.createCipher(algorithm,password);
var crypted = cipher.update(text,'utf8','hex');
crypted += cipher.final('hex');
return crypted;
}

function decrypt(text){
var decipher = crypto.createDecipher(algorithm,password);
var dec = decipher.update(text,'hex','utf8');
dec += decipher.final('utf8');
return dec;
}

//
exports.handle_request_login = function(msg,callback) {

	var res = {};
	var username = msg.username;
	console.log(username);
	var password = msg.password;
	// var password = encrypt(password1);
	console.log(password);


	if ((username !== undefined) && (password !== undefined)) {
		mongo.connect(mongoURL, function () {
			console.log("Connected to mongo at: " + mongoURL);
			var collxn = mongo.collection('users');

			collxn.findOne({ $or:[{USERNAME: username },{ EMAIL: username}], PASSWORD: password}, function (err, user) {
				console.log(user);
				if (user) {
					console.log("Credentials accepted");

					res.username = user.USERNAME;
					res.email = user.EMAIL;
					var firstname1 = user.FIRSTNAME;
					res.firstname = firstname1.toUpperCase();
					var lastname1 = user.LASTNAME;
					res.lastname = lastname1.toUpperCase();
					var dateTime = user.Ltime;
					var d = new Date(dateTime);
					var dateT = d.toString();
					//console.log(dateT);

					res.date1 = dateT.substring(0, 10);
					//console.log(date1);

					res.time1 = dateT.substring(16, 24);
					//console.log(time1);
					//win_logger.log('info', 'user - ' + msg.session.username + ' - successfully in login');
					//json_responses = {"statusCode": 200}
					res.value = "Success Login";
					res.code = "200";
					//On Successful login Updating the timestamp of the login to the current date Time
					console.log('to update the last timestamp of the login');
					//win_logger.log('info', 'user - ' + msg.session.username + ' - updating the timestamp of the last login time of the user to the Current Time');
					var collxn = mongo.collection('users');
					collxn.update({USERNAME: username}, {$set: {Ltime: new Date()}});
					//win_logger.log('info', 'user - ' + msg.session.username + ' - updated the timestamp of the last login time of the user to the Current Time');

				}
				else {
					console.log("Username and password does not matches");
					win_logger.log('info', 'user - ' + username + ' - unsuccessfully in login');
					res.code = "401";
					res.value = "Failed Login";



				}
				callback(err,res);
			}); // end of findone
		}); // end of mongo client
	} // end if
	else {

			res.code = "401";
			win_logger.log('info', 'user - ' + username + ' - blank username or password');
			res.value="Failed Login";

	}
}; //end of handle request


// sign up validation
exports.handle_request_signup = function(msg,callback)
{
	// check user already exists
	var res = {};
	var first = msg.first;
	var last = msg.last;
	var email = msg.email;

	var password1 = msg.password;
	var pass = encrypt("password1");
	console.log(pass);
	console.log(first);
	console.log(last);
	console.log(email);

	var phone = msg.phone;
	console.log(phone);
	if ((first !== undefined) &&(email !== undefined)&&(password1 !== undefined)&&(phone !== undefined)&& (last !== undefined)) {



	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('users');
		collxn.findOne({EMAIL: email}, function (err, user) {
			if(user) {
				//console.log("SAHIL KAW");
				console.log("user with name " + first + " " + last +  " exists");
				res.code = "401"
				res.email = email;
				console.log(res.email);
				res.firstname = first;
				console.log(res.firstname);
				console.log("User not Created");
				res.value = first+ " "+ last + "exists";
				callback(err,res);
			}
		else {
				var user1 = first.substring(0,4) + last.substring(0,4) +"_" + Math.round(Math.random()*1000);
				//console.log(user);
				collxn.insert({
					USERNAME: user1,
					FIRSTNAME: first,
					LASTNAME: last,
					EMAIL: email,
					PASSWORD: pass,
					PHONE: phone,
					BALANCE: 10000,
					JOINING: new Date(),
					Birthday: "10/25/1999",

					Ltime: new Date()
				}, function(err,user){
                    if(user) {


                        //msg.session.username = user; // To assign the session to the user
                       // msg.session.firstname = first;// To assign the session to the firstname
                        //console.log(msg.session.username);
                        //console.log(msg.session.firstname);
                        //win_logger.log('info', 'user - ' + first + " " + last + ' - successfully assigning unique username');
                        //json_responses = {"statusCode": 200};
                        //res.send(json_responses);
						res.code = "200"
						res.username = user1;
						console.log(res.username);
						res.firstname = first;
						console.log(res.firstname);
						console.log("User Created");
                    }

                    callback(err,res);
                    });
			}
		})
	})
	};
}

	
