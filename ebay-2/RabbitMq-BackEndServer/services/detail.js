var ejs = require("ejs");
var mongo = require("./mongo");
var win_logger = require('winston');
var mongoURL = "mongodb://localhost:27017/ebay";

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
};

exports.detailofBidProducts = function (req,res){
	
	
	var id = req.param('id');
	req.session.id = id;
	console.log(req.session.id);
	//var myResult = "Select * from product where ITEM_CODE IN('" + 3 +"'" + ",'" + 7 +"'" +",'"+ 4 +"');" ;
	var myResult = "Select * from product where ITEM_CODE ='" + id +"';" ;
	
	
	console.log("Query is:" + myResult);
	var json_responses;
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
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
};		


exports.detailProduct = function (req,res){
	
	//console.log(req.session.id);
	//console.log(req.session.username);
	var id = req.session.id;
	console.log("I am doing good");
	console.log(id);
	//var myResult = "Select * from product where ITEM_CODE IN('" + 3 +"'" + ",'" + 7 +"'" +",'"+ 4 +"');" ;
	var myResult = "Select * from product where ITEM_CODE ='" + id +"';" ;
	//var myResult = "select B.ITEM_CODE,B.ITEM_NAME,B.ITEM_DESC,B.ITEM_PRICE,B.ITEM_QTY,B.SELLER_FIRSTNAME,B.SELLER_LASTNAME,B.EMAIL," +
	//"B.SELLER_USERNAME,B.category,B.Group_Name,B.COND,B.max_price,B.min_price, count(A.ITEM_CODE) as num, B.BID from bid A, " +
	//"PRODUCT B  where A.ITEM_CODE = B.ITEM_CODE and B.ITEM_CODE='" + id +"'group by B.ITEM_CODE,B.ITEM_NAME," +
	//"B.ITEM_DESC,B.ITEM_PRICE,B.ITEM_QTY,B.SELLER_FIRSTNAME,B.SELLER_LASTNAME,B.EMAIL,B.SELLER_USERNAME,B.category,B.Group_Name,B.COND,B.max_price,B.min_price,B.BID;";
	console.log("Query is:" + myResult);
	var json_responses;
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				var newres = {"jsonParse": jsonParse,"rowcount":results.length};
				console.log("result123" +results);
				win_logger.log('info', 'user - '+req.session.username+' - fetching  successful details of the BID product');
				console.log("result" +jsonParse);
				res.send(newres);
			}
			else{
				console.log("No reords in the database");
				win_logger.log('info', 'user - '+req.session.username+' - fetching unsuccessful details of the BID product');
			}
		}
	},myResult);
};		


