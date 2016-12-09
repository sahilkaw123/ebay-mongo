var ejs = require("ejs");
var mongo = require("./mongo");
var win_logger = require('winston');
var mongoURL = "mongodb://localhost:27017/ebay";
var mq_client = require('../rpc/client');

exports.openProfilePage = function(req,res)
{
	console.log(" I m here");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - Profile page with shopping records');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("profile",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}

};

exports.person = function(req,res)
{
	console.log(" I m not in the here");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - Users personal Profile page');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("person",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}

};

exports.personDetail = function(req,res){
	var user = req.session.username;
	console.log("username is  "+ user);
	var msg_payload = {"username": user};
	console.log("In POST Request = UserName:" + user);
	mq_client.make_request('profile_queue', msg_payload, function (err, results) {
		if (results.code == "200") {
			console.log(results);
			//console.log("result");
			res.send({"result": results});
			win_logger.log('info', 'user - ' + username + ' - displayed other users products');

		}
		else{
			console.log("not Successful");
		}
		})
	};

/*
 
exports.profileDetail = function(req,res){
	var username = req.session.username;
	console.log("username is  "+ username);
	var buyResult = "Select * from orders where Buyer_Username ='" + username +"';" ;
	var sellResult = "Select * from orders where Seller_Username ='" + username +"';" ;
	console.log("Query is:" + buyResult);
	console.log("Query is:" + sellResult);
var json_responses;
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				//var newres = {"jsonParse": jsonParse,"rowcount":results.length};
				console.log("result" +results.length);
				console.log("result" +jsonParse);
				console.log("I am here444");
				
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err1;
					}
					else{
						var jsonString1 = JSON.stringify(results1);
						var jsonParse1 = JSON.parse(jsonString1);
						var newres = {"jsonParse": jsonParse,"rowcount":results.length,"jsonParse1":jsonParse1,"rowcount1":results1.length};
						console.log("result" +results1.length);
						console.log("result" +jsonParse1);
						console.log("I am here555");
						json_responses = {"statusCode" : 200};
						//res.send(json_responses);
						res.send(newres);
					}
				},sellResult);
				
			
			
		}
	},buyResult);
};


 */


//
exports.updatePerson = function(req,res){
	var contact = req.param('contact');
	var birth = req.param('birth');
	var email = req.param('email');
	console.log("contact is  "+ contact);
	console.log("birth is  "+ birth);
	console.log("email" + email);
	var user = req.session.username;
	console.log("username is  "+ user);
	var msg_payload = {"username": user,"contact":contact,"birth":birth,"email":email};
	console.log("In POST Request = UserName:" + user);
	mq_client.make_request('profile_update_queue', msg_payload, function (err, results) {
		if (results.code == "200") {
			console.log(results);
			//console.log("result");
			res.send({"code": 200});
			win_logger.log('info', 'user - ' + username + ' - displayed other users products');

		}
		else{
			console.log("not Successful");
		}
	})
};

//
exports.profileDetail = function(req,res){
	var username = req.session.username;
	console.log("username is  "+ username);
	var msg_payload = {"username": username};
	console.log("In POST Request = UserName:" + username);
	mq_client.make_request('summary_queue', msg_payload, function (err, results) {
		console.log(results);
		if (results.code == "200") {
			console.log(results);
			//console.log("result");
			win_logger.log('info', 'user - ' + username + ' - displayed other users products');
			res.send({"result": results});
		}
		else{
			console.log("not Successful");
		}
	})
};


