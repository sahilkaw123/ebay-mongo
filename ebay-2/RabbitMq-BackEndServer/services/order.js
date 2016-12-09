var ejs = require("ejs");
var mongo = require("./mongo");
var win_logger = require('winston');
var mongoURL = "mongodb://localhost:27017/ebay";




exports.placeOrder = function(req,res){
	if(req.session.username)
	{
		console.log(" I m not here12");
		win_logger.log('info', 'user - '+req.session.username+' - redirecting to Order page');
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('placeOrder');

	}

};
//render page

//
exports.confirmOrder = function(req,res){
console.log(" I m not here11");

//Checks before redirecting whether the session is valid
console.log(req.session.username);
if(req.session.username)
{
	console.log(" I m not here12");
	win_logger.log('info', 'user - '+req.session.username+' - redirecting to Order page');
	//Set these headers to notify the browser not to maintain any cache for the page being loaded
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('order',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
	
}

};
/*
exports.confirmOrder = function(req,res){
	res.render('order');
}; */
//Display products to the shopping Cart
exports.getCreditCardDetails = function(req,res){
	var Username = req.session.username;
	
	var getNameDetails = "select FIRSTNAME,LASTNAME from user where USERNAME ='" + Username +"';";
	mysql.fetchData(function(err2,results2){
		if(err2){
			throw err;
		}
		else 
		{		
			
			console.log("Name Fetched Successfully." + "\n");
			console.log( results2);
			 // returing the JSON code to the Angular
			var jsonString = JSON.stringify(results2);
			var jsonParse = JSON.parse(jsonString);
			win_logger.log('info', 'user - '+req.session.username+' - fetching credit card details');
			var newres = {"jsonParse": jsonParse,"rowcount":results2.length};
			console.log("F"+ newres.FIRSTNAME+"L" +  newres.LASTNAME );
			res.send(newres);
			   }
		
		},getNameDetails);
};



//
exports.confirmPage = function(req,res)
{
	console.log(" I m here");
	
	//Checks before redirecting whether the session is valid

		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - redirecting to confirmation page');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("placeOrder",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname,email:req.session.email});
		

};




exports.updt_Money_detail = function(msg,callback){
	var Username = msg.username;



	var res = {};
	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('cart');
		collxn.find({"BUYER_USERNAME": Username}).toArray(function (err, user) {
			if (err) {
				throw err;
			}
			else {
				for (var x = 0; x < user.length; x++) {
					var ITEM_CODE = user[x].ITEM_CODE;
					var ITEM_NAME = user[x].ITEM_NAME;
					var ITEM_DESC = user[x].ITEM_DESC;
					var QUANTITY = user[x].QUANTITY;
					var SELLER_USERNAME = user[x].SELLER_USERNAME;
					var BUYER_USERNAME = user[x].BUYER_USERNAME;
					var PRICE = user[x].PRICE;
					var TOTAL_PRICE = user[x].TOTAL_PRICE;
					var collxn = mongo.collection('cart');
					console.log(ITEM_CODE);
					console.log(ITEM_NAME);
					console.log(ITEM_DESC);
					console.log(QUANTITY);
					console.log(SELLER_USERNAME);
					console.log(BUYER_USERNAME);
					console.log(PRICE);
					console.log(TOTAL_PRICE);


					var collxn = mongo.collection('order');
					collxn.insert({
						ITEM_CODE: ITEM_CODE,
						ITEM_NAME: ITEM_NAME,
						ITEM_DESC: ITEM_DESC,
						QUANTITY: QUANTITY,
						SELLER_USERNAME: SELLER_USERNAME,
						BUYER_USERNAME: BUYER_USERNAME,
						PRICE: PRICE,
						TOTAL_PRICE: TOTAL_PRICE

					}, function (err, user) {
						if (err) {
							throw err;
						}
						else {
							res.code = "200"
							var collxn = mongo.collection('users');
							collxn.update({"USERNAME": SELLER_USERNAME },{ $inc: { "BALANCE": TOTAL_PRICE } }, function (err, user) {
								if (err) {
									throw err;
								}
								else {
									var collxn = mongo.collection('products');
									collxn.update({"ITEM_CODE": ITEM_CODE },{ $inc: { "ITEM_QTY": - QUANTITY } },function (err, user) {
										if (err) {
											throw err;
										}
										else {
											var collxn = mongo.collection('users');
											collxn.update({"USERNAME": Username },{ $inc: { "BALANCE": - TOTAL_PRICE } }, function (err, user) {
												if (err) {
													throw err;
												}

											})

											}
										})
									}

								})
							}

						})

						//callback(err, res);
					}

				var collxn = mongo.collection('cart');
				collxn.remove({"BUYER_USERNAME": Username }, function (err, user) {
					if (err) {
						throw err;
					}
					callback(err,res);
				})
				}



			})
		})
	}





			/*	collxn.aggregate([{ $match: {BUYER_USERNAME : Username } }, { $group:{_id : null, 'total' : {'$sum' :  '$TOTAL_PRICE'}}}], function(err,user1){
					if(err){
						throw err;
					}
					else
					{

						var collxn = mongo.collection('cart');
						//console.log("ABC" + B_Username);
						collxn.aggregate([{ $match: {BUYER_USERNAME : Username } }, { $group:{_id : null, 'QTYC1' : {'$sum' :  '$QUANTITY'}}}], function(err,user2){
							if(err){
								throw err;
							}
							else
							{


								res.code = "200";

								res.rslt = user;
								res.QTYC = user2[0].QTYC1;
								res.cart_Price = user1[0].total;
								//console.log(user);


							}

							callback(err,res);
						});

					}


				});




			}

		})
	});
};

*/






exports.checkOut_queue_prod = function(msg,callback){
		var Username = msg.username;


		var cart_Price = "";
		var name = " ";
		var desc = " ";
		var QTYC = " ";
		var QTY = " ";
		var S_Usrname =" ";
		var Price = " ";
		var Bid = " ";
		var pic = " ";
		var Total_Price = " ";
		var B_Username = " ";
		var res = {};
		mongo.connect(mongoURL, function () {
			console.log("Connected to mongo at: " + mongoURL);
			var collxn = mongo.collection('cart');
			collxn.find({"BUYER_USERNAME": Username}).toArray(function (err, user) {
				if(err) {
					throw err;
				}
				else{


					var collxn = mongo.collection('cart');

					collxn.aggregate([{ $match: {BUYER_USERNAME : Username } }, { $group:{_id : null, 'total' : {'$sum' :  '$TOTAL_PRICE'}}}], function(err,user1){
						if(err){
							throw err;
						}
						else
						{

							var collxn = mongo.collection('cart');
							//console.log("ABC" + B_Username);
							collxn.aggregate([{ $match: {BUYER_USERNAME : Username } }, { $group:{_id : null, 'QTYC1' : {'$sum' :  '$QUANTITY'}}}], function(err,user2){
								if(err){
									throw err;
								}
								else
								{


									res.code = "200";

									res.rslt = user;
									res.QTYC = user2[0].QTYC1;
									res.cart_Price = user1[0].total;
									//console.log(user);


								}

								callback(err,res);
							});

						}


					});




				}

			})
		});
	};

