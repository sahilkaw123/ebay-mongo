var ejs = require("ejs");
var mysql = require('./mongo');
		
exports.getMyProducts = function (req,res){
	var SELLER_USERNAME = req.session.username;
	console.log(req.session.firstname);
	
	var myResult = "Select * from product where SELLER_USERNAME<>'" + SELLER_USERNAME +"'ORDER BY  GROUP_NAME;" ;
	console.log("Query is:" + myResult);
	
	
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
	},myResult);
};	

exports.detailofPage = function(req,res)
{
	console.log(" I m not here11");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		console.log(" I m not here12");
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('detail',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}
	
};
/*
exports.detailofPage = function(req,res){
	res.render('detail');
};
	*/	

exports.detailofProducts = function (req,res){
	
	
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
				json_responses = {"statusCode" : 200};
				res.send(json_responses);
				//res.send(newres);
			}
			else{
				console.log("No reords in the database");
			}
		}
	},myResult);
};		