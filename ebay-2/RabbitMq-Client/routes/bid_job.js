/*var ejs = require("ejs");
//var mysql = require('./mysqlpool');  // using pool
var mysql = require('./mongo'); // without using pool
var mq_client = require('../rpc/client');
var win_logger = require('winston');


exports.bid_job = {

	after: {
		seconds: 5,
		minutes: 0,
		hours: 0,
		days: 0
	},
	job: function () {

		console.log("Checking if bids have been completed or not");

		var msg_payload = {"user": 1};
		console.log("In POST Request = UserName:" + user);
		mq_client.make_request('bid_check_queue', msg_payload, function (err, results) {
			if (err) {
				throw err;


			}
			else {
				win_logger.log('info',  ' - checked for the 4 days window time frame');
				console.log("bid check Successful");
			}
		})
	}
}; */

var mq_client = require('../rpc/client');

exports.bid_job = {

	after: {
		seconds: 0,
		minutes: 0,
		hours: 2,
		days: 0
	},
	job: function () {

		console.log("checking bids");
		//var date  = new Date(datetime);
		//console.log("XXX" + date);
		var msg_payload = { "item":1};

		mq_client.make_request('bid_check_queue',msg_payload, function(err,results){

			console.log("sending biding request")

			if(err){
				throw err;
			}
			else
			{


				if(results.code == 200){

					req.session.item = results.currentItem;

					winston_logger.log('info', 'User - '+req.session.username+' - clicks to view item '+req.session.item.item_code);

					res.send({"statuscode":200, "item":results.currentItem});

				}
				else {
					winston_logger.log('info', 'No Item completed bidding as yet');
					console.log("No Item completed bidding as yet");

				}
			}
		});

	},
	spawn: true
}