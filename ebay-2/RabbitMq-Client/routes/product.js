var ejs = require("ejs");
var mongo = require("./mongo");
var win_logger = require('winston');
var mongoURL = "mongodb://localhost:27017/ebay";
var mq_client = require('../rpc/client');
		
exports.getMyProducts = function (req,res){
	var username = req.session.username;
	console.log("XXX" + username);
	var msg_payload = {"username": username};
	console.log("In POST Request = UserNameXX:" + username);
	mq_client.make_request('product_queue', msg_payload, function (err, results) {
		//console.log("ABG" + results);
		if (err) {
			throw err;
		}
		else {
			if (results.code == "200") {
				//console.log(results);
				win_logger.log('info', 'user - ' + username + ' - displayed other users products');
				res.send({"results": results});
			}
			else {
				console.log("Product not found");
				win_logger.log('info', 'user - ' + username + ' - no products from other sellers');
				res.send({"login": "Fail"});
			}
		}
	});
}; // end of the function of signin


/*
		mongo.connect(mongoURL, function () {
			console.log("Connected to mongo at: " + mongoURL);
			var collxn = mongo.collection('users');

			collxn.find({"SELLER_USERNAME":{$not:{$eq: username}}}, function (err, user) {

				if (user) {
					console.log("Products found");
					win_logger.log('info', 'user - ' + req.session.username + ' - displayed other users products');
					//var jsonString = JSON.stringify(user);
					//var jsonParse = JSON.parse(jsonString);
					//var newres = {"jsonParse": jsonParse,"rowcount":user.count};
					//console.log("result" +user.length);
					//console.log("result" +jsonParse);
					json_responses = {"statusCode": 200};
					res.send(json_responses);

				}
				else {

					json_responses = {"statusCode": 401};
					win_logger.log('info', 'user - ' + username + ' - No  other seller product at this time');

					res.send(json_responses);

				}
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
exports.detailofPage = function(req,res){
	res.render('detail');
};
	*/	

/*exports.detailofProducts = function (req,res){
	
	
	var id = req.param('id');
	req.session.id = id;
	console.log(req.session.id);

	var msg_payload = {"id": id};
	console.log("In POST Request = id:" + id);
	mq_client.make_request('detail_product_queue', msg_payload, function (err, results) {
		//console.log("ABG" + results);
		if (err) {
			throw err;
		}
		else {
			if (results.code == "200") {
				//console.log(results);
				win_logger.log('info', 'user - ' + username + ' - displayed other users products');
				res.send({"results": results});
			}
			else {
				console.log("Product not found");
				win_logger.log('info', 'user - ' + username + ' - no products from other sellers');
				res.send({"login": "Fail"});
			}
		}
	});
}; // end of the function of signin */