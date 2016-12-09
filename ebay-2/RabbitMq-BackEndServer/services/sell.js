var ejs = require("ejs");
//var mysql = require('./mysqlpool');  // using pool
var mongo = require('./mongo'); // without using pool
var mongoURL = "mongodb://localhost:27017/ebay";
var win_logger = require('winston');
// to validate  the login user signin function 

exports.listProdDetail_que = function(msg,callback){





	var username = msg.username;
	console.log("XXX" + username);

	var res = {};


	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('products');

		collxn.find().sort({ITEM_CODE:-1}).limit(1).toArray(function (err, user) {

			if (user) {
				console.log("Products found");
				console.log(user);

				res.rslt = user;
				res.code = "200";
				//res.send({'rslt':user,"code":"200"});

			}
			else {

				res.code = "401";
				//win_logger.log('info', 'user - ' + username + ' - No  other seller product at this time');

				//res.send(json_responses);

			}
			callback(err,res);
		})
	})
};

//rendering to signin page of ebay 

exports.signin = function(req,res){
	res.render('signin');
};




//HomePage redirection

//Redirects to the homepage
exports.loadSellPage = function(req,res)
{
	console.log(" I m here to Sell");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - loading the selling page for user');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("sell",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname,email:req.session.email});
		
	}
	else
	{
		res.redirect('/signin');
	}
};

//Logout the user - invalidate the session

exports.listPage = function(req,res)
{
	console.log(" I m here");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - showing the listing to the user');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("ProductListing",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}

};

//Signup

exports.signup = function(req,res) {

	ejs.renderFile('./views/signup.ejs', function(err, result) {
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
};

// sign up validation
exports.list_queue_prod = function(msg,callback) {
	// check user already exists
	var res = {};
	var SELLER_FIRSTNAME = msg.SELLER_FIRSTNAME;
	var SELLER_LASTNAME = msg.SELLER_LASTNAME;
	var EMAIL = msg.EMAIL;
	var SELLER_USERNAME = msg.SELLER_USERNAME;
	var ITEM_NAME = msg.ITEM_NAME;
	var ITEM_PRICE = parseInt(msg.ITEM_PRICE);
	var ITEM_QTY = parseInt(msg.ITEM_QTY);
	var ITEM_DESC = msg.ITEM_DESC;
	var min_price = parseInt(msg.ITEM_PRICE);
	var category = msg.category;
	var BID = msg.BID;
	var Group_Name = msg.Group_Name;
	var COND = msg.COND;
	var pic = msg.pic;
	//var ITEM_CODE = 7;
	var a = new Date();
	var currDate = new Date(a.setDate(a.getDate()));
	var bidDate = new Date(a.setDate(a.getDate() + 4));
	var bidDay = bidDate-currDate;
	console.log("Current Date " + currDate);
	console.log("Bid End Date " + bidDate);
	console.log("Time Left in milliseconds " + bidDay);
	/*if (currDate<bidDate){
		console.log("Ww");
	}
	else{
		console.log("yy");
	}*/
	//console.log(S_LASTNAME);
	//console.log(S_USERNAME);
	//console.log(EMAIL);
	mongo.connect(mongoURL, function () {
		console.log("Connected to mongo at: " + mongoURL);
		var collxn = mongo.collection('products');
		collxn.aggregate({$group: {_id: '', ITEM_COD: {$max: "$ITEM_CODE"}}}, function (err, user2) {
			if (user2) {
				var ITEM_CO = user2[0].ITEM_COD;
				console.log("Fetched Item Code" + ITEM_CO);
				var ITEM_CODE = ITEM_CO + 1;
				console.log("Item_CODE" + ITEM_CODE);

				mongo.connect(mongoURL, function () {
					console.log("Connected to mongo at: " + mongoURL);
					var collxn = mongo.collection('products');

					collxn.insert({
						ITEM_CODE: ITEM_CODE,
						ITEM_NAME: ITEM_NAME,
						ITEM_DESC: ITEM_DESC,
						ITEM_PRICE: min_price,
						ITEM_QTY: ITEM_QTY,
						SELLER_FIRSTNAME: SELLER_FIRSTNAME,
						SELLER_LASTNAME: SELLER_LASTNAME,
						EMAIL: EMAIL,
						category: category,
						Group_Name: Group_Name,
						COND: COND,
						BID: BID,
						BidStat: 0,
						pic: pic,
						SELLER_USERNAME: SELLER_USERNAME,
						currDate: currDate,
						bidDate: bidDate


					}, function (err, user) {
						if (user) {
							//res.code = "200"
							//res.username = user;
							//console.log(res.username);
							//res.firstname = first;
							//console.log(res.firstname);
							//console.log("User Created");
							var collxn = mongo.collection('bid');
							collxn.insert({
								ITEM_CODE: ITEM_CODE,
								ITEM_NAME: ITEM_NAME,
								ITEM_DESC: ITEM_DESC,
								ITEM_PRICE: parseInt(min_price),
								BID: BID,
								BidStat: 0,
								SELLER_USERNAME: SELLER_USERNAME,
								currDate: currDate
							}, function (err, user1) {
								if (user1) {
									res.code = "200"
								}
								callback(err, res);
							});
							//
						}

					});
				})

				//
			}
		});
	})
}