var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var md5 = require('md5');

exports.openProfilePage = function(req,res)
{
	console.log(" I m here");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - Profile page with shopping records');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("profile",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}

};

exports.person = function(req,res)
{
	console.log(" I m not in the here");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - Users personal Profile page');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("person",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}

};

exports.personDetail_que = function(msg,callback) {
	var res = {};
	var username = msg.username;
	console.log(username);

	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('users');

		collxn.find({USERNAME: username}).toArray(function (err, user) {
			if (user.length > 0) {


				res.rslt = user;
				res.code = 200;
				console.log(user);
			}
			callback(err,res);
		})
	})
}

 

//
exports.updtProfDetail_que = function(msg,callback){
	var res = {};
	var contact = msg.contact;
	var birth = msg.birth;
	var email = msg.email;
	var username = msg.username;
	console.log("contact is  "+ contact);
	console.log("birth is  "+ birth);
	console.log("email" + email);
	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('users');
		collxn.update({USERNAME: username}, {
			$set: {
				PHONE: contact,
				Birthday: birth,
				email: email
			}
		}, function (err, user) {
			if(user){
				res.code = 200;
			}
			callback(err,res);
		})
	})
	};

exports.summaryDetail_que = function(msg,callback) {
	var username = msg.username;
	var res = {};
	console.log("username is  " + username);
	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('order');

		collxn.find({SELLER_USERNAME: username}).toArray(function (err, user1) {
			if (user1.length >= 0) {
				//console.log("SAHIL");
				//res.rslt1 = user1;
				//res.len1  = user1.length;

				console.log("Connected to mongo at: " + mongoURL);
				var collxn = mongo.collection('order');

				collxn.find({BUYER_USERNAME: username}).toArray(function (err, user2) {
					if (user2.length >= 0) {
						//console.log("SAGAR");
						var collxn = mongo.collection('bidorder');

						collxn.find({SELLER_USERNAME: username}).toArray(function (err, user3) {
							if(user3.length>=0) {
								var collxn = mongo.collection('products');

								collxn.find({SELLER_USERNAME: username, BID: 1, BidStat:0}).toArray(function (err, user4) {
									if (user4.length >= 0) {
										console.log("HI");
										
										var ITEM_COD = user4.ITEM_CODE;
										console.log(ITEM_COD);
										var collxn = mongo.collection('bid');

										collxn.find({ITEM_CODE: ITEM_COD}).toArray(function (err, user5) {
											if (user5.length >= 0) {
												var collxn = mongo.collection('bidorder');

												collxn.find({BUYER_USERNAME: username}).toArray(function (err, user6) {
													if (user6.length >= 0) {
														var collxn = mongo.collection('bid');
														collxn.find({BUYER_USERNAME: username}).toArray(function (err, user7) {
															if (user7.length >= 0) {
																console.log("xxx" + user7);

																var collxn = mongo.collection('bid');
																collxn.find({BUYER_USERNAME: username}).toArray(function (err, user8) {
																	if (user8.length >= 0) {
																		var ITEM_NUM = user8[0].ITEM_CODE;
																		console.log("MMM" + ITEM_NUM);

																		var collxn = mongo.collection('bidorder');
																		collxn.find({ "ITEM_CODE" : ITEM_NUM, "BUYER_USERNAME": {$not:{$eq:username}}}).toArray(function (err, user9) {

																			if (user9.length >= 0) {
																				console.log(user9);
																			}







											res.code = "200"
											res.rslt1 = user1;
											res.len1 = user1.length;
											res.rslt2 = user2;
											res.len2 = user2.length;
											res.rslt3 = user3;
											res.len3 = user3.length;
											res.rslt4 = user5;
											res.len4 = user5.length;
													res.rslt5 = user6;
													res.len5 = user6.length;
													res.rslt6 = user7;
													res.len6 = user7.length;
																			res.rslt7 = user9;
																			res.len7 = user9.length;

													callback(err, res);
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
							}
						})
					}
				})
			}


		})

	})
};