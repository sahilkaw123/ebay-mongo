var ejs = require("ejs");
//var mysql = require('./mysqlpool');  // using pool
var mongo = require('./mongo'); // without using pool
var mongoURL = "mongodb://localhost:27017/ebay";
var win_logger = require('winston');

exports.list_queue_bid_detail = function(msg,callback){


	var res = {};
	var id = msg.id;
	var Max_Price;
	var bidsNo;

	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('products');
		collxn.find({"ITEM_CODE": id, $where : "this.currDate < this.bidDate",BID:1,BidStat:0 }).toArray(function (err, user) {
			if(user.length>0){
				var collxn = mongo.collection('bid');
				//res.user;
				collxn.find({"ITEM_CODE": id}).toArray(function (err, user1) {

					if(user1.length>0){
						//var BidsLen =
						//console.log(BidsLen);
						var collxn = mongo.collection('bid');
						collxn.aggregate([{ $match: {ITEM_CODE : id } }, { $group:{_id : null, 'max_Price' : {'$max' :'$ITEM_PRICE'}}}]).toArray(function (err, user2) {
							console.log("SAJOL");
							if(user2.length>0) {
								//var Max_Price =

								res.rslt = user;
								res.code =200;
								res.Max_Price =user2[0].max_Price;
								res.bidsNo = user1.length - 1;
								console.log(user2[0].max_Price);
								console.log(user1.length - 1);
							}
							callback(err,res);
						})
					}

			})
			}
			else{
				console.log("No records in the database");
			}
			//callback(err,res);
		})
	});
};


	
	
	
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
exports.bid_check_queue_detail = function(msg,callback){


	var res = {};
	var id = msg.id;
	var BidPrice = parseInt(msg.bidP);
	var Max_Price;
	var bidsNo;
	console.log(BidPrice);
	var ITEM_CODE = " ";
	var	ITEM_NAME = " ";
	var	ITEM_DESC = " ";
	var	ITEM_PRICE= " ";
	var	BID = " ";
	var	BidStat = " ";
	var	SELLER_USERNAME = " ";
	var	dateNew =  new Date();
	var BuyerName = msg.username;

	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('products');
		collxn.find({"ITEM_CODE": id, $where : "this.currDate < this.bidDate",BID:1,BidStat:0 }).toArray(function (err, user) {
			if(user.length>0){
					//console.log(user[0].ITEM_CODE);
			        ITEM_CODE = user[0].ITEM_CODE,
				    ITEM_NAME = user[0].ITEM_NAME,
					ITEM_DESC= user[0].ITEM_DESC,
					ITEM_PRICE = user[0].ITEM_PRICE,
					BID = user[0].BID,
					BidStat = user[0].BidStat,
					SELLER_USERNAME = user[0].SELLER_USERNAME
					console.log(ITEM_CODE);
				var collxn = mongo.collection('bid');
				//res.user;
				collxn.find({"ITEM_CODE": id}).toArray(function (err, user1) {

					if(user1.length>0){
						//var BidsLen =
						//console.log(BidsLen);
						var collxn = mongo.collection('bid');
						collxn.aggregate([{ $match: {ITEM_CODE : id } }, { $group:{_id : null, 'max_Price' : {'$max' :'$ITEM_PRICE'}}}]).toArray(function (err, user2) {

							if(user2.length>0) {
								//var Max_Price =

								//res.code =200;
								Max_Price =user2[0].max_Price;
								console.log("AAA" +  Max_Price);
								if (BidPrice > Max_Price ){
								console.log("I am here");

									var collxn = mongo.collection('bid');
									collxn.insert({
										ITEM_CODE: ITEM_CODE,
										ITEM_NAME: ITEM_NAME,
										ITEM_DESC: ITEM_DESC,
										ITEM_PRICE: BidPrice,
										BID: BID,
										BidStat: BidStat,
										SELLER_USERNAME: SELLER_USERNAME,
										BUYER_USERNAME: BuyerName,
										currDate: dateNew
									}, function (err, user3) {
										if (user3) {
											res.code = "200"
										}
										callback(err, res);
									})
//
								}


							}

						})
					}

				})
			}
			else{
				console.log("No records in the database");
			}
			//callback(err,res);
		})
	});
};



exports.bidHistory = function(req, res){


	
		console.log(" I m not at all here12");
	win_logger.log('info', 'user - '+req.session.username+' - redirecting to bidding history on the product');
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('bidHistory',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	
};
//
exports.bid_History_queue_prod = function(msg,callback){


	var res = {};
	var id = msg.id;
	//var Max_Price;
	//var bidsNo;

	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('bid');
		collxn.find({"ITEM_CODE": id, "BUYER_USERNAME":{$not:{$eq: null}}}).toArray(function (err, user) {
			if (user.length > 0) {
				//console.log(user[0].ITEM_CODE);
				console.log(user);
				//var dateTime = user[0].currDate;
				//console.log()
				//var d = new Date(dateTime);
				//var dateT = d.toString();
				//console.log(dateT);

				//var date1 = dateT.substring(0, 15);
				//console.log(date1);
				//req.session.date = date1;
				//var time1 = dateT.substring(16, 24);
				//console.log(time1);
				//win_logger.log('info', 'user - '+req.session.username+' - fetching bidding timestamp');
				//console.log("NOTDONE123");
				//console.log("result" +results.length);
				//console.log("result" +jsonParse);
				//var newres = {"jsonParse": jsonParse,"rowcount":results.length,"date1":date1,"time1":time1};

				res.rslt = user;
				//res.date = date1;
				//res.time = time1;
				res.code = 200;
				res.length = user.length;

			}
			callback(err, res);
		})
	})
}


//
exports.bid_Time_Fetch_detail = function(msg,callback){


		var res = {};
		var id = msg.id;
		//var Max_Price;
		//var bidsNo;

		mongo.connect(mongoURL, function () {
			console.log("Connected to mongo at: " + mongoURL);
			var collxn = mongo.collection('products');
			collxn.find({"ITEM_CODE": id}).toArray(function (err, user) {
				if (user.length > 0) {
					//console.log(user[0].ITEM_CODE);

					var dateTime = user[0].bidDate;
					console.log()
					var d = new Date(dateTime);
					var dateT = d.toString();
					//console.log(dateT);

					var date1 = dateT.substring(0, 15);
					console.log(date1);
					//req.session.date = date1;
					var time1 = dateT.substring(16, 24);
					console.log(time1);
					//win_logger.log('info', 'user - '+req.session.username+' - fetching bidding timestamp');
					//console.log("NOTDONE123");
					//console.log("result" +results.length);
					//console.log("result" +jsonParse);
					//var newres = {"jsonParse": jsonParse,"rowcount":results.length,"date1":date1,"time1":time1};
					res.date = date1;
					res.time = time1;
					res.code = 200;

				}
				callback(err, res);
			})
		})
}
				

		


//
//
exports.bidHistoryProd = function (req,res){
var id = req.param('id');
req.session.id = id;
var username = req.session.username;
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
