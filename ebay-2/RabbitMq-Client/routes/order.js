var ejs = require("ejs");
//var mysql = require('./mysqlpool');  // using pool
var mongo = require('./mongo'); // without using pool

var win_logger = require('winston');

var mq_client = require('../rpc/client');

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


/*
exports.updateMoney = function(req,res){
	var username = req.session.username;
	var output = " ";
    var amount = " ";
    var name = " ";
    var output1 = "";
    var Code = "";
    var Qty = "";
    var output4 = "";
	var Amt = "";
	var output2 = "";
	var json_responses;
	var sellerMoney = "select SUM(TOTAL_PRICE) as total, SELLER_USERNAME from cart where BUYER_USERNAME = '" + username+"' group by (Seller_Username);";
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Query is Successful." + "\n");
				console.log(results);
				
				for (var i in results) {
		            output = results[i];
		            amount = output.total;
		            name = output.SELLER_USERNAME;
		            console.log(amount);
		            console.log(name);
		            
		      var updatePrice = "update user set balance = balance +" + amount + " where USERNAME ='"+ name+"';";      
			 //sql query to distribute the share of the prices 
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err;
					}
					else 
					{
						console.log("Data *** Successfully." + "\n");
						var getQty = "select ITEM_CODE, QUANTITY from cart where BUYER_USERNAME = '" + username+"';";
						
						console.log("Data  -- Successfully." + "\n");
						console.log( results1);
						mysql.fetchData(function(err,results2){
							if(err){
								throw err;
							}
							else 
							{
								if(results2.length > 0){
									console.log("Query5 is Successful." + "\n");
									console.log(results);
									
									for (var i in results2) {
							            output2 = results2[i];
							            Code = output2.ITEM_CODE;
							            Qty = output2.QUANTITY ;
							            console.log(Code);
							            console.log(Qty);
							            var updateQty = "update product set ITEM_QTY = ITEM_QTY - " + Qty + " where ITEM_CODE ='"+ Code+"';";  		            
							            
							            mysql.fetchData(function(err3,results3){
											if(err3){
												throw err;
											}
											else 
											{		
												
												console.log("Data --->> Successfully." + "\n");
												console.log( results3);
												var updateBuyer = "SELECT SUM(TOTAL_PRICE) as cart_Price FROM cart where BUYER_USERNAME ='" + username +"';";
												 mysql.fetchData(function(err4,results4){
														if(err4){
															throw err;
														}
														else 
														{
															console.log("result4 is successful" );
															console.log(results4);
															//for (var i in results4){
																output4 = results4;
																Amt = output4[0].cart_Price;
																console.log("xxx"+ Amt);
															//}
																var updtUBal = "update user set Balance = Balance - " + Amt +" " + " where USERNAME ='" + username +"';";
																
																
																mysql.fetchData(function(err5,results5){
																	if(err5){
																		throw err;
																	}
																	else 
																	{	
																		var updtOrdr = "INSERT INTO ORDERS (ORDERID, ITEM_NAME, ITEM_DESC ,QUANTITY ,INDIVIDUAL_PRICE," +
																		"Buyer_Username, Seller_USERNAME, TOTAL_PRICE,bid) Select ITEM_CODE,ITEM_NAME, ITEM_DESC ,QUANTITY,PRICE,Buyer_USERNAME,Seller_Username, Total_Price,bid from cart where BUYER_USERNAME ='" + username +"';";
																		console.log("results5 is successful" );
																		console.log("Query is" + updtOrdr)
																		console.log(results5);
																		//Copying shopping cart to Order table for record and deleting the shopping cart table.
																		mysql.fetchData(function(err6,results6){
																			if(err5){
																				throw err;
																			}
																			else 
																			{	
																				console.log("result6 is successful" );
																				console.log(results6);
																				
																				var delCart = "delete from cart where Buyer_Username ='" + username +"';";
																				console.log("Query is" + delCart)
																				
																				mysql.fetchData(function(err7,results7){
																					if(err5){
																						throw err;
																					}
																					else 
																					{	
																						console.log("result7 is successful" );
																						console.log(results7);
																						win_logger.log('info', 'user - '+req.session.username+' - updating the qty, money fron buyer and user');
																						json_responses = {"statusCode" : 200};
																						res.send(json_responses);
																					}
																				},delCart);
																			}	
																		},updtOrdr);
																	}
																},updtUBal);	
														}
												 },updateBuyer);
												   }
											},updateQty);	    
									}}}
						},getQty);
								}		
					},updatePrice);	
				}}
			} 
		},sellerMoney);
};
*/

exports.updateMoney = function(req,res){
	var username = req.session.username;
	console.log(username);
	var msg_payload = {"username": username};
	//console.log("In POST Request = username:" + username);
	mq_client.make_request('updt_Money_queue', msg_payload, function (err, results) {
		console.log(results.QTYC);
		if (err) {
			throw err;
		}
		else {
			if (results.code == "200") {
				//console.log(results);
				console.log(results);
				win_logger.log('info', 'user - ' + req.session.username + ' -Order Successful Shopping Cart deleted');
				res.send({"results": results});
			}
			else {
				console.log("Transaction not updated");
				win_logger.log('info', 'user - ' + req.session.username + ' - Order placing failed');

			}
		}
	});
}; // end of the function of signin */


exports.checkOutProducts = function(req,res){
	var username = req.session.username;
	console.log(username);
	var msg_payload = {"username": username};
	//console.log("In POST Request = username:" + username);
	mq_client.make_request('checkOut_queue', msg_payload, function (err, results) {
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

