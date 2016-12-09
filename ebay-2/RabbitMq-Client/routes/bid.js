var ejs = require("ejs");
var mongo = require('./mongo');
var win_logger = require('winston');
var mq_client = require('../rpc/client');

exports.bidProduct = function (req,res){
	
	
	var id = req.session.id;
	 
	console.log(req.session.id);

	var msg_payload = {"id": id};
	console.log("In POST Request = id:" + id);
	mq_client.make_request('detail_of_bid_product_queue', msg_payload, function (err, results) {
		//console.log("ABG" + results);
		if (err) {
			throw err;
		}
		else {
			if (results.code == "200") {
				console.log(results);
				win_logger.log('info', 'user - ' + req.sessionusername + ' - displayed other users products');
				res.send({"results": results});
			}
			else {
				console.log("Product not found");
				win_logger.log('info', 'user - ' + req.sessionusername + ' - no products from other sellers');

			}
		}
	});
}; // end of the function of signin */






exports.bidPage = function(req, res){
	
		console.log(" I m not here11");
		
		//Checks before redirecting whether the session is valid
		console.log(req.session.username);
		if(req.session.username)
		{
			console.log(" I m not here12");
			win_logger.log('info', 'user - '+req.session.username+' - redirect to bidding page');
			//Set these headers to notify the browser not to maintain any cache for the page being loaded
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render('bid',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
			
		}
};

exports.confirmBidPage = function(req, res){
	
	console.log(" I m not here11");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		console.log(" I m not here12");
		win_logger.log('info', 'user - '+req.session.username+' - redirect to update bidding amount');
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('bidSuccess',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}
};

//bid History Page

//
exports.bidCmp = function (req,res){
	//var output = " ";
    /*var Code = " ";
    var name = " ";
    var desc = " ";
	var x = " ";*/
	//console.log(req.session.id);
	//console.log(req.session.username);
	var id = req.param('id');
	req.session.id = id;
	var bidP = req.param('bidP');
	console.log(bidP);
	var username = req.session.username;
	var ITEM_NAME = req.param('ITEM_NAME');
	var ITEM_DESC = req.param('ITEM_DESC');

	var msg_payload = {"id": id,"bidP":bidP,"ITEM_NAME":ITEM_NAME,"ITEM_DESC":ITEM_DESC,"username":username};
	console.log("In POST Request = id:" + id);
	mq_client.make_request('bid_check_queue', msg_payload, function (err, results) {
		//console.log("ABG" + results);
		if (err) {
			throw err;
		}
		else {
			if (results.code == "200") {
				console.log(results.code);
				win_logger.log('info', 'user - ' + req.sessionusername + ' - displayed other users products');
				res.send({"login": "Success"});
			}
			else {
				console.log("Product not found");
				win_logger.log('info', 'user - ' + req.sessionusername + ' - no products from other sellers');

			}
		}
	});
}; // end of the function of signin */
		
exports.bidHistory = function(req, res){


	
		console.log(" I m not at all here12");
	win_logger.log('info', 'user - '+req.session.username+' - redirecting to bidding history on the product');
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('bidHistory',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	
};
//
exports.historyProduct = function (req,res){
	var id  = req.session.id;

	var msg_payload = {"id": id};
	console.log("In POST Request = id:" + id);
	mq_client.make_request('bid_History_Fetch', msg_payload, function (err, results) {
		//console.log("ABG" + results);
		if (err) {
			throw err;
		}
		else {
			if (results.code == "200") {
				console.log(results.rslt);
				//console.log(results.time);
				win_logger.log('info', 'user - ' + req.session.username + ' - displayed other users products');
				res.send({"result": results.rslt,"length":results.length});
			}
			else {
				console.log("Bid ending Time not fetched");
				win_logger.log('info', 'user - ' + req.session.username + ' - no products from other sellers');

			}
		}
	});
}; // end of the function of signin */
			
//
exports.bidTimeFetch = function (req,res){
	var id  = req.session.id;

	var msg_payload = {"id": id};
	console.log("In POST Request = id:" + id);
	mq_client.make_request('bid_Time_Fetch', msg_payload, function (err, results) {
		//console.log("ABG" + results);
		if (err) {
			throw err;
		}
		else {
			if (results.code == "200") {
				console.log(results.date);
				console.log(results.time);
				win_logger.log('info', 'user - ' + req.session.username + ' - displayed other users products');
				res.send({"date": results.date,"time": results.time});
			}
			else {
				console.log("Bid ending Time not fetched");
				win_logger.log('info', 'user - ' + req.session.username + ' - no products from other sellers');

			}
		}
	});
}; // end of the function of signin */
		


//
//
exports.bidHistoryProd = function (req,res) {
	var id = req.param('id');
	req.session.id = id;
	var username = req.session.username;
	res.send({"code":200})


}




	/*
var json_responses;
var noOfBids = "Select * from bid where Buyer_Username is not null and ITEM_CODE ='" + id +"';" ;
mysql.fetchData(function(err,results){
	if(err){
		throw err;
	}
	else{
		if(results.length >= 0){
			win_logger.log('info', 'user - '+req.session.username+' - bidding history - no of bids');
			json_responses = {"statusCode" : 200};
			res.send(json_responses);
		}
			
}
},noOfBids);	
};
		
*/
		
/*		
		
	}
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				console.log("Still time for bidding");
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err1;
					}
					else{
						if(results.length > 0){
							
						}
							
				
				
			}
			else{
				
				ejs.renderFile('./views/successbid.ejs',function(err, result) {
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
				
				
			}
		}
			
				
			
	},timeChk); 

};		

*/
