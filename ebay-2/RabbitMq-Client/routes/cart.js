var ejs = require("ejs");
//var mysql = require('./mysqlpool');  // using pool
var mongo = require('./mongo'); // without using pool

var win_logger = require('winston');

var mq_client = require('../rpc/client');

exports.addProducts = function(req,res)
{

	var username = req.session.username;
	var id = req.param('item_id');
	var Qty = req.param('Qty');


	var msg_payload = {"id": id,"Qty":Qty,"username": username};
	console.log("In POST Request = id:" + id+ " Qty: " + Qty + "username:" + username);
	mq_client.make_request('add_toCart_queue', msg_payload, function (err, results) {
		if (err) {
			throw err;
		}
		else {
			if (results.code == "200") {
				//console.log(results);
				win_logger.log('info', 'user - ' + req.session.username + ' - shopping cart');
				res.send({"code": "200"});
			}
			else {
				console.log("Not Added to Cart");
				win_logger.log('info', 'user - ' + req.session.username + ' - Product not added to cart');

			}
		}
	});
}; // end of the function of signin */


exports.displayCartPage = function(req,res){
	console.log(" I m not here11");
		
		//Checks before redirecting whether the session is valid
		console.log(req.session.username);
		if(req.session.username)
		{
			console.log(" I m not here12");
			win_logger.log('info', 'user - '+req.session.username+' - redirecting to cart page');
			//Set these headers to notify the browser not to maintain any cache for the page being loaded
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render('cart',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
			
		}
		
	};


exports.removeProducts = function(req,res){
	var id = req.param('id');
	console.log("id"+ id);
	var myResult = "Delete from cart where ITEM_CODE ='" + id +"';" ;
	console.log("Query is:" + myResult);
var json_responses;
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				var newres = {"jsonParse": jsonParse,"rowcount":results.length};
				console.log("result" +results.length);
				console.log("result" +jsonParse);
				console.log("I am here444");
			win_logger.log('info', 'user - '+req.session.username+' - removing from cart');
				json_responses = {"statusCode" : 200};
				res.send(json_responses);
				//res.send(newres);
			
			
		}
	},myResult);
};



exports.displayProducts = function(req,res){
	var username = req.session.username;

	var msg_payload = {"username": username};
	//console.log("In POST Request = username:" + username);
	mq_client.make_request('display_Cart_queue', msg_payload, function (err, results) {
		console.log(results.QTYC);
		if (err) {
			throw err;
		}
		else {
			if (results.code == "200") {
				//console.log(results);
				console.log(results);
				win_logger.log('info', 'user - ' + req.session.username + ' - cart for user');
				res.send({"results": results});
			}
			else {
				console.log("Not Added to Cart");
				win_logger.log('info', 'user - ' + req.session.username + ' - Cart Empty');

			}
		}
	});
}; // end of the function of signin */
