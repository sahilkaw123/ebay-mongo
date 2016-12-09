var ejs = require("ejs");
var mongo = require("./mongo");
var win_logger = require('winston');
var mongoURL = "mongodb://localhost:27017/ebay";

// Add Products to shopping cart
exports.handle_add_toCart_product = function(msg,callback)
{
	// check user already exists



	
	//var output = " ";
    var name = " ";
    var desc = " ";
    var Qty1 = " ";
    var S_Usrname =" ";
    var Price = " ";
	var Bid = " ";
	var pic = " ";
	var Total_Price = " ";

	
	//query to check if the item is already added to the user 
	//var checkItem="select * from cart where ITEM_CODE='"+ id + "'" + "AND BUYER_USERNAME='" + username+"';" ;
	var res = {};
	var id = msg.id;
	var B_Username = msg.username;
	var Qty = parseInt(msg.Qty);

	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('products');
		collxn.findOne({"ITEM_CODE": id}, function (err, user) {
			if(user){
				res.code = "200"
				res.rslt = user;
				console.log(res.rslt);
				name = user.ITEM_NAME;
				desc = user.ITEM_DESC;
				S_Usrname =user.SELLER_USERNAME;
				Price = user.ITEM_PRICE;
				Bid = user.BID;
				pic = user.pic;
				console.log(name);
				console.log(desc);
				console.log(S_Usrname);
				console.log(Price);
				console.log(pic);
				console.log(Bid);
				console.log(B_Username);
				console.log(Qty);
				Total_Price = Qty * Price;
				console.log(Total_Price);

				mongo.connect(mongoURL, function () {
					console.log("Connected to mongo at: " + mongoURL);
					var collxn = mongo.collection('cart');
					collxn.insert({
						ITEM_CODE: id,
						ITEM_NAME: name,
						ITEM_DESC: desc,
						QUANTITY: Qty,
						SELLER_USERNAME: S_Usrname,
						BUYER_USERNAME: B_Username,
						PRICE: Price,
						PIC: pic,
						bid: Bid,
						TOTAL_PRICE: Total_Price

					}, function(err,user){
						if(err){
							throw err;
						}
						else
						{
							res.code = "200"


						}

						callback(err,res);
					});
				})



			}
			else{
				console.log("No records in the database");
			}
			callback(err,res);
		})
	});
};

/*
	var getDetails="select * from product where ITEM_CODE='"+ id + "'"; 
	
	
	//console.log("Query is:"+checkItem);
	console.log("Query is:"+getDetails);
	//console.log("Query is:"+addUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Data Fetched Successfully." + "\n");
				console.log(results);
				
				for (var i in results) {
		            output = results[i];
		            name = output.ITEM_NAME;
		            desc = output.ITEM_DESC;
		            Qty1 = output.ITEM_QTY;
		            S_Usrname = output.SELLER_USERNAME;
		            Price = output.ITEM_PRICE;
		            Bid = output.BID;
		            pic = output.pic;
		            
		            
				}
				var T_Price = Qty*Price;
				var addUser = "INSERT INTO cart (ITEM_CODE, ITEM_NAME, ITEM_DESC, QUANTITY, SELLER_USERNAME, BUYER_USERNAME, TOTAL_PRICE ,PRICE,PIC, bid) VALUES" +
			    "('" + id + "','"+ name +"','" + desc +"','" + Qty +"','" + S_Usrname +"','" + B_Usrname +"','"+ T_Price +"','" + Price +"','" + pic + "','" + Bid +"');";
				 
				console.log("test"+output);
			    //sql query to insert the values in the  cart
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err;
					}
					else 
					{					
						console.log("Data Inserted Successfully." + "\n");
						 // returing the JSON code to the Angular
						win_logger.log('info', 'user - '+req.session.username+' - product addedd successfully to cart');
						json_responses = {"statusCode" : 200};
						res.send(json_responses);
						   }
					
					},addUser);	
			}
			} 
		},getDetails);
}; */

//render the cart page

//Display products to the shopping Cart
/*
exports.displayProducts = function(req,res){
	var Username = req.session.username;
	
	var getProduct = "select ITEM_CODE,ITEM_NAME,ITEM_DESC,QUANTITY,SELLER_USERNAME,BUYER_USERNAME,PRICE,PIC," +
			"cart_id,TOTAL_PRICE,SUM(TOTAL_PRICE) as Cart_Price from cart where BUYER_USERNAME ='" + Username +"';";
	
	var cartPrice = "SELECT SUM(TOTAL_PRICE) as total_mark FROM cart where BUYER_USERNAME ='" + Username +"';";
	
	console.log("Select Query "+ getProduct);
	
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
				res.send(newres);
			}
			else{
				console.log("No reords in the database");
			}
		}
	},getProduct);
};		
*/
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
/*
exports.displayCartPage = function(req,res){
	res.render('cart');
};
*/
//Display products to the shopping Cart

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

/*
exports.displayProducts = function(req,res){
	var Username = req.session.username;
	
	var output1 = "";
    var cart_price = "";
	
	var getProduct = "select ITEM_CODE,ITEM_NAME,ITEM_DESC,QUANTITY,SELLER_USERNAME,BUYER_USERNAME,PRICE,PIC," +
			"cart_id,TOTAL_PRICE from cart where BUYER_USERNAME ='" + Username +"';";
	
	
	
	console.log("Select Query "+ getProduct);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Data Fetched Successfully." + "\n");
				console.log(results);
				
				
				var cartPrice = "SELECT SUM(TOTAL_PRICE) as cart_Price FROM cart where BUYER_USERNAME ='" + Username +"';";
			 //sql query to display shopping cart
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err;
					}
					else 
					{		
						
						console.log("Data tucked Successfully." + "\n");
						console.log( results1);
						 // returing the JSON code to the Angular
						var jsonString = JSON.stringify(results);
						var jsonParse = JSON.parse(jsonString);
						var newres = {"jsonParse": jsonParse,"rowcount":results.length,"cart_Price":results1};
						console.log(newres.cart_Price);
						res.send(newres);
						   }
					
					},cartPrice);	
			}
			} 
		},getProduct);
}; */

exports.display_Cart_product = function(msg,callback){
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
				//res.code = "200"
				//res.rslt = user;
				//console.log(res.rslt);
				//name = user.ITEM_NAME;
				//desc = user.ITEM_DESC;
				//S_Usrname =user.SELLER_USERNAME;
				//Price = user.PRICE;
				//Bid = user.bid;
				//pic = user.PIC;
				//B_Username = user.BUYER_USERNAME;
				//QTY = user.QUANTITY;
				//Total_Price = user.TOTAL_PRICE;
				//console.log(name);
				//console.log(desc);
				//console.log(S_Usrname);
				//console.log(Price);
				//console.log(pic);
				//console.log(Bid);
				//console.log(B_Username);
				//console.log(QTY);
				//console.log(Total_Price);

				//mongo.connect(mongoURL, function () {
					//console.log("Connected to mongo at: " + mongoURL);

					var collxn = mongo.collection('cart');

					collxn.aggregate([{ $match: {BUYER_USERNAME : Username } }, { $group:{_id : null, 'total' : {'$sum' :  '$TOTAL_PRICE'}}}], function(err,user1){
						if(err){
							throw err;
						}
						else
						{
							//cart_Price = user1[0].total;
							//console.log(cart_Price);
							//console.log(cart_Price);
							//res = {};
							var collxn = mongo.collection('cart');
							//console.log("ABC" + B_Username);
							collxn.aggregate([{ $match: {BUYER_USERNAME : Username } }, { $group:{_id : null, 'QTYC1' : {'$sum' :  '$QUANTITY'}}}], function(err,user2){
								if(err){
									throw err;
								}
								else
								{

									//QTYC = user2[0].QTYC1;
									res.code = "200";
									//console.log(cart_Price);
									//console.log(QTYC);
									//console.log(cart_Price);
									//console.log(S_Usrname);
									//res.QTYC = user2[0].QTYC1;
									res.rslt = user;
									res.QTYC = user2[0].QTYC1;
									res.cart_Price = user1[0].total;
									//console.log(user);


								}

								callback(err,res);
							});

						}

						//callback(err,res);
					});
				//})



			}
			//else{
			//	console.log("No records in the database");
			//}
			//callback(err,res);
		})
	});
};




/*
	var getProduct = "select ITEM_CODE,ITEM_NAME,ITEM_DESC,QUANTITY,SELLER_USERNAME,BUYER_USERNAME,PRICE,PIC," +
			"cart_id,TOTAL_PRICE from cart where BUYER_USERNAME ='" + Username +"';";
	
	
	
	console.log("Select Query "+ getProduct);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Data Fetched Successfully." + "\n");
				console.log(results);
				
				
				var cartPrice = "SELECT SUM(TOTAL_PRICE) as cart_Price FROM cart where BUYER_USERNAME ='" + Username +"';";
			 //sql query to display shopping cart
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err;
					}
					else 
					{		
						
						console.log("Data tucked Successfully." + "\n");
						console.log( results1);
						 // returing the JSON code to the Angular
						
						var cartCount = "SELECT SUM(QUANTITY) as QTYC FROM cart where BUYER_USERNAME ='" + Username +"';";
						mysql.fetchData(function(err2,results2){
							if(err1){
								throw err;
							}
							else 
							{	
								console.log( "QTYC"+ results2[0].QTYC);
								var QTYC = results2[0].QTYC;
								req.session.QTYC = QTYC;
								console.log(QTYC);
								var jsonString = JSON.stringify(results);
								var jsonParse = JSON.parse(jsonString);
								win_logger.log('info', 'user - '+req.session.username+' - displaying total product and total price');
								var newres = {"jsonParse": jsonParse,"rowcount":results.length,"cart_Price":results1,"QTYC":results2};
								console.log(newres.cart_Price);
								res.send(newres);
							}
						},cartCount);
						
						   }
					
					},cartPrice);	
			}
			} 
		},getProduct);
};
*/