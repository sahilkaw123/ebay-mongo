var ejs = require("ejs");
var mysql = require('./mongo');
		

	
	exports.bid_job = {
		    
		    after: {                
		        seconds: 1,
		        minutes:0,
		        hours: 0,
		        days: 0
		    },
		    job: function (req,res) {	
	
		    	var  output = '';
		           var id = '';
		    	var bidEndTimeChk = "Select Item_Code from bidCheck where tme <= Current_Timestamp;" ;
		    	//var maxPrice = "Select max(PRICE_BID) as M_Price from bid where ITEM_CODE ='" + id +"';" ;
		    	//var insMaxBid = "INSERT INTO bidOrder Select A.ITEM_CODE,  max(A.PRICE_BID) as M_Price, B.Seller_USERNAME, " +
		    	//		"A.Buyer_Username,A.ITEM_NAME from bid A , Product B  where  A.Buyer_Username != ' ' and  A.ITEM_CODE = B.ITEM_CODE  group by A.ITEM_CODE, A.ITEM_NAME, A.Buyer_Username,B.Seller_USERNAME " +
		    //			"having max(A.PRICE_BID) =(Select max(PRICE_BID) from bid where ITEM_CODE = '" + id +"'  );"
		    			
		    	mysql.fetchData(function(err,results){
		    		if(err){
		    			throw err;
		    		}
		    		else{
		    			if(results.length > 0){
		    				console.log("Bide Complete." + "\n");
		    				console.log(results);
		    				
		    				for (var i in results) {
		    		          var  output = results[i];
		    		           var id = output.Item_Code;
		    		            console.log(id);
		    		            
		    		            var insMaxBid = "INSERT INTO bidOrder Select A.ITEM_CODE,  max(A.PRICE_BID) as M_Price, B.Seller_USERNAME, A.Buyer_Username,A.ITEM_NAME, A.Qty from bid_dup A , Product B  where A.Buyer_Username IS NOT NULL and A.ITEM_CODE = B.ITEM_CODE  group by A.ITEM_CODE, A.ITEM_NAME, A.Buyer_Username,A.Qty,B.Seller_USERNAME having max(A.PRICE_BID) =(Select max(PRICE_BID) from bid where ITEM_CODE = '" + id +"')";
		    		            mysql.fetchData(function(err1,results1){
		    		            	if(err1){
		    			    			throw err;
		    			    		}
		    		            	else{
		    		            		for (var x in results) {
		    		            		 var  output = results[x];
		    		            		var id = output.Item_Code;
		    		            		console.log(id);
		    		            		var delBidEntry = "Delete from bidCheck where ITEM_CODE = '" + id +"';";
		    		            		mysql.fetchData(function(err2,results2){
				    		            	if(err2){
				    			    			throw err;
				    			    		}
				    		            	else{
				    		            		for (var y in results) {
				    		            		 var  output = results[y];
				    		            		var id = output.Item_Code;
				    		            		console.log("ID is" + id);
				    		            		var delBidTimecheck = "Delete from bid_dup where ITEM_CODE = '" + id +"';";
				    		            		console.log("I am done");
				    		            		mysql.fetchData(function(err3,results3){
						    		            	if(err3){
						    			    			throw err;
						    			    		}
						    		            	else{
						    		            		for (var z in results) {
							    		            		 var  output = results[z];
							    		            		var id = output.Item_Code;
							    		            		console.log("ID is" + id);
						    		            		var updtMoney = "Select distinct (Max_BIDP), SELLER_NAME,Buyer_Name,Qty from bidOrder_dup where ITEM_code = '" + id +"';";
						    		            		console.log("I am done");
						    		            		mysql.fetchData(function(err4,results4){
								    		            	if(err4){
								    			    			throw err;
								    			    		}
								    		            	else{
								    		            		if(results.length > 0){
								    		            			for (var a in results4) {
								    		        		            output = results4[a];
								    		        		            amount = output.Max_BIDP;
								    		        		            S_name = output.SELLER_NAME;
								    		        		            B_name = output.Buyer_Name;
								    		        		            QTY = output.Qty;
								    		        		            var updatePrice = "update user set balance = balance +" + amount + " where USERNAME ='"+ S_name+"';"; 
								    		        		            mysql.fetchData(function(err4,results4){
												    		            	if(err4){
												    			    			throw err;
												    			    		}
												    		            	else{
												    		            		for (var q in results) {
													    		            		 var  output = results[q];
													    		            		var id = output.Item_Code;
												    		            		var delEntryPrice = "Delete from bidOrder_dup where ITEM_CODE = '"+ id +"';";
												    		            		console.log("update.done");
												    		            		mysql.fetchData(function(err4,results4){
												    		            			if(err4){
														    			    			throw err;
														    			    		}
												    		            			else{
												    		            				console.log("deletion");
												    		            			}
												    		            			
												    		            		}.delEntryPrice);
												    		            	}
												    		            		}
								    		        		            },updatePrice);
								    		        		            
								    		            		}
								    		            			}
								    		            		}
						    		            		},updtMoney);
								    		            	}
						    		            		}
						    		            	
						    		            	
				    		            	},delBidTimecheck);
				    		            	}
				    		            	}	
		    		            	},delBidEntry);
		    		            	}
		    		            	}
		    		            },insMaxBid);
		    				
		    		}
		    		}
		    		}
		    	},bidEndTimeChk);
		    }};
