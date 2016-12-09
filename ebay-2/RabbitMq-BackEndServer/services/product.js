var ejs = require("ejs");
var mongo = require("./mongo");
var win_logger = require('winston');
var mongoURL = "mongodb://localhost:27017/ebay";


exports.handle_request_product = function(msg,callback){
	var username = msg.username;
	console.log("XXX" + username);

	var res = {};


		mongo.connect(mongoURL, function () {
			console.log("Connected to mongo at: " + mongoURL);
			var collxn = mongo.collection('products');

			collxn.find({"SELLER_USERNAME":{$not:{$eq: username}}}).toArray(function (err, user) {

				if (user) {
					console.log("Products found");
					console.log(user);

					res.rslt = user;
					res.code = "200";
					//res.send({'rslt':user,"code":"200"});

				}
				else {

					res.code = "401";
					//win_logger.log('info', 'user - ' + username + ' - No  other seller product at this time');

					//res.send(json_responses);

				}
				callback(err,res);
			})
		})
};

/*
exports.handle_request_product = function(msg,callback){
	var username = msg.username;
	console.log("XXX" + username);

	var res = {};


	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('products');

		collxn.find({"SELLER_USERNAME":{$not:{$eq: username}}}).toArray(function (err, user) {

			if (user.length>0) {
				console.log(user);
				for (var x =0; x<user.length; x++) {
					//console.log(user[x].ITEM_CODE);

					console.log(user[x]);
					//res.ITEM = user[x].ITEM_CODE;
					res.rslt = user[x];
				}
				res.code = "200";
				//res.send({'rslt':user,"code":"200"});

			}
			else {

				res.code = "401";
				//win_logger.log('info', 'user - ' + username + ' - No  other seller product at this time');

				//res.send(json_responses);

			}
			callback(err,res);
		})
	})
};
*/


exports.detailofPage = function(req,res)
{
	console.log(" I m not here11");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		console.log(" I m not here12");
		win_logger.log('info', 'user - '+req.session.username+' - redirecting to detail of product page');
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('detail',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}
	
};

/*
exports.handle_request__detail_product = function(msg,callback){

	var res = {};
	var id = msg.id;

	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('products');
		collxn.find({"ITEM_CODE": id}).toArray(function (err, user) {
		if(user){
			res.code = "200";
			res.rslt = user;
			}
			else{
				console.log("No records in the database");
			}
			callback(err,res);
		})
	});
}; */