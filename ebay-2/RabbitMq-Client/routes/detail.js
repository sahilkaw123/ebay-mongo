var ejs = require("ejs");
var mongo = require('./mongo');
var win_logger = require('winston');
var mq_client = require('../rpc/client');

exports.detailofProducts = function (req,res){


	var id = req.body.id;
	console.log("My id is" + id)
	req.session.id = id;
	console.log(req.session.id);
	res.send({"code": "200"})
}; // end of the function of signin

exports.detailofBidProducts = function (req,res) {


	var id = req.param('id');
	req.session.id = id;
	console.log(req.session.id);
	//var myResult = "Select * from product where ITEM_CODE IN('" + 3 +"'" + ",'" + 7 +"'" +",'"+ 4 +"');" ;
	//var myResult = "Select * from product where ITEM_CODE ='" + id +"';" ;
	res.send({"code": "200"})
};
	
	//console.log("Query is:" + myResult);
	//var json_responses;
	
	//mysql.fetchData(function(err,results){
		//if(err){
	/*		throw err;
		}
		else{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				var newres = {"jsonParse": jsonParse,"rowcount":results.length};
				console.log("result" +results.length);
				console.log("result" +jsonParse);
				win_logger.log('info', 'user - '+req.session.username+' - fetching  successful individual details of the BID product');
				json_responses = {"statusCode" : 200};
				res.send(json_responses);
				//res.send(newres);
			}
			else{
				console.log("No reords in the database");
				win_logger.log('info', 'user - '+req.session.username+' - fetching not successful individual details of the BID product');
			}
		}
	},myResult);
};	*/


exports.detailProduct = function (req,res){
	
	//console.log(req.session.id);
	//console.log(req.session.username);
	var id = req.session.id;
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


