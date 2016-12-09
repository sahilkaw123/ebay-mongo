var ejs = require("ejs");
//var mysql = require('./mysqlpool');  // using pool
var mongo = require('./mongo'); // without using pool
var mongoURL = "mongodb://localhost:27017/ebay";
var win_logger = require('winston');
// to validate  the login user signin function

exports.bidCheck_que = function(msg,callback) {
	//var username = msg.username;
	//console.log("XXX" + username);

	var res = {};
	var id = [];

	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('products');
		var a = new Date();
		console.log(a);
		//var dates = new Date(a.setDate(a.getDate()));
		//console.log( + dates);
		//console.log("XXX" + a);
		collxn.find({$and: [{BidStat: 0, BID: 1}, {bidDate: {$gt: a}}]}).toArray(function (err, user) {

			if (user.length > 0) {
				//var x = user.length;

				for (var i in user) {

					var output = user[i];
					id.push(user[i].ITEM_CODE);
					//id.res = user[1].ITEM_CODE
					console.log("DERAA -  " + id[i]);
				}
				//for (var i in user) {

				//console.log("DERBB -  " + id[i]);
				var collxn = mongo.collection('products');
				collxn.find({ITEM_CODE: id[i]}).toArray(function (err, user1) {

					if (user1.length > 0) {
						//console.log(user1);
						//
						//for (var i in user) {
						i = 0;
						var collxn = mongo.collection('bid');
						collxn.aggregate([{$match: {ITEM_CODE: id[i]}}, {
							$group: {
								_id: null,
								'max_Price': {'$max': '$ITEM_PRICE'}
							}
						}]).toArray(function (err, user2) {

							if (user2.length > 0) {
								var Max_Price = user2[i].max_Price;
								console.log(Max_Price);
								console.log(user2);

								var collxn = mongo.collection('bid');
								collxn.find({ITEM_CODE: id[i], "ITEM_PRICE": Max_Price}).toArray(function (err, user3) {
									if (user3.length > 0) {
										var Buyer_user = user3[i].BUYER_USERNAME;
										/*	console.log(user3[i].BUYER_USERNAME);
										 console.log(user3[i].ITEM_CODE);
										 console.log(user3[i].ITEM_NAME);
										 console.log(Max_Price);
										 console.log(user3[i].SELLER_USERNAME);
										 console.log(user3[i].BUYER_USERNAME);*/

										var collxn = mongo.collection('bidorder');
										collxn.insert({
											ITEM_CODE: user3[i].ITEM_CODE,
											ITEM_NAME: user3[i].ITEM_NAME,
											ITEM_DESC: user3[i].ITEM_DESC,
											ITEM_PRICE: Max_Price,
											SELLER_USERNAME: user3[i].SELLER_USERNAME,
											BUYER_USERNAME: Buyer_user


										}, function (err, user4) {
											if (user4) {
													var collxn = mongo.collection('users');
													collxn.update({"USERNAME": user3[i].SELLER_USERNAME },{ $inc: { "BALANCE": Max_Price } }, function (err, user) {
													if (err) {
														throw err;
													}
													else {
													var collxn = mongo.collection('users');
													collxn.update({"USERNAME": Buyer_user },{ $inc: { "BALANCE": - Max_Price } }, function (err, user) {
														if (err) {
															throw err;
														}
													else {
												console.log(BALANCE);
												var collxn = mongo.collection('products');
												collxn.update({"USERNAME": user3[i].SELLER_USERNAME}, {$inc: {"ITEM_QTY": -1}}, function (err, user) {
													console.log(user3[i].SELLER_USERNAME);
												})
											}
												})
												}

												})

												}


										})

											}


										})


									}

								})
								//
								//}
							}

						})
						//}
						//}
					}


				})
			})
		};




	/*mysql.fetchData(function(err,results){
		    		if(err){
		    			throw err;
		    		}
		    		else{
		    			if(results.length > 0){
		    				console.log("Bids Complete." + "\n");
		    				console.log(results);
							win_logger.log('info', 'user -  - checking bidding time cron job');
		    				for (var i in results) {
		    		         var  output = results[i];
		    		           id.push = output.Item_Code;
		    				}
		    		            console.log(id);
		    		            var updateStat = "update bidStat set BidStat = 1 where ITEM_CODE ='" + results[i].Item_Code +"';";
		    		            	mysql.fetchData(function(err1,results1){
		    		            		if(err1){
		    				    			throw err;
		    				    		}
		    				    		else{
											win_logger.log('info', 'user -  - updating bidding status to completed for all products in Bidstat table whose bidding ended cron job');
		    				    			var insMaxBid = "INSERT INTO bidOrder Select A.ITEM_CODE,  max(A.PRICE_BID) as M_Price, B.Seller_USERNAME, A.Buyer_Username,A.ITEM_NAME, A.Qty from bid_dup A , Product B  where A.Buyer_Username IS NOT NULL and A.ITEM_CODE = B.ITEM_CODE  group by A.ITEM_CODE, A.ITEM_NAME, A.Buyer_Username,A.Qty,B.Seller_USERNAME having max(A.PRICE_BID) =(Select max(PRICE_BID) from bid where ITEM_CODE = '" + results[i].Item_Code  +"')";		
		    		            			mysql.fetchData(function(err2,results2){
		    		            				if(err2){
				    				    			throw err;
				    				    		}
		    		            				else{
													win_logger.log('info', 'user -  - inserting into bidOrder table cron job');
		    		            					 var updtProd = "update product set BidStat = 1 where ITEM_CODE ='" + results[i].Item_Code +"';";		
		    		            					mysql.fetchData(function(err6,results6){
		    		            						if(err6){
						    				    			throw err;
						    				    		}
		    		            						else{
															win_logger.log('info', 'user -  - updating bidding status to completed for all products in product table whose bidding ended cron job');
		    		            					var finddet = "Select Max_BidP, Seller_Name, Buyer_Name,Qty from bidOrder where ITEM_CODE ='" + results[i].Item_Code  +"';";
		    		            					mysql.fetchData(function(err3,results3){
		    		            						if(err3){
						    				    			throw err;
						    				    		}
				    		            				else{
															win_logger.log('info', 'user -  - chosing the max bid price and buyer');
				    		            					if(results3.length>0){
				    		            					for (var i in results3) {
				    		            			            output1 = results3[i];
				    		            			            bidp = output1.Max_BidP;
				    		            			            BuyNm = output1.Buyer_Name;
				    		            			            SellNm = output1.Seller_Name;
				    		            			            Qty = output1.Qty;      
				    		            			      }
				    		            					buyN = BuyNm;
				    		            					sellN = SellNm;
				    		            					amt = bidp;
				    		            					console.log(buyN);
				    		            					console.log(sellN);
				    		            			var addMoney = "Update user set Balance = Balance +" + amt +""+" where username ='"+sellN +"';";
				    		            			mysql.fetchData(function(err4,results4){
				    		            				if(err4){
						    				    			throw err;
						    				    		}
				    		            				else{
															win_logger.log('info', 'user -  - updating seller account money ');
				    		            					var delMoney =  "Update user set Balance = Balance -" + amt +" "+"where username ='"+buyN+"';";
				    		            					mysql.fetchData(function(err5,results5){
						    		            				if(err5){
								    				    			throw err;
								    				    		} else{
																	win_logger.log('info', 'user -  - updating buyer account and QTY');
								    				    			console.log("Done for checking");
								    				    			
								    				    			}
				    		            				},delMoney);
				    		            				}
				    		            			},addMoney);
				    		            				}		
		    		            				}
		    		            					},finddet);
		    		            					}
		    		            				},updtProd);
		    		            				}
		    		            			},insMaxBid);
		    				    		}
		    		            	},updateStat);
		    			}}
		    	},bidEndTimeChk);
		    }};
*/