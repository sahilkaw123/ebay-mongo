var app = angular.module("bid", []);

app.controller('bidController',function ($scope, $http){ 
	
	//$scope.Now = function(ITEMCODE){
	//	$scope.value = ITEMCODE;
	//	console.log($scope.value);
	window.onload = function(){
		
		$http({
			method :"GET",
			url : "/bidProduct",
			data : {
				
			}
		}).success(function(response){
			$scope.newResult1 = response.results;
			$scope.newResult= $scope.newResult1.rslt
			$scope.ROW_COUNT= $scope.newResult1.bidsNo;
			$scope.BID_PRICE = $scope.newResult1.Max_Price;
			console.log($scope.newResult1.rslt);
			console.log($scope.newResult1.Max_Price);
			console.log($scope.newResult1.bidsNo);
			//console.log($scope.BID_PRICE);
		});
	
}; 

//$scope.placeBid = function(ITEMCODE, BidP){
$scope.placeBid = function(ITEMCODE, Nbid, ITEM_NAME, ITEM_DESC){
	$scope.value = ITEMCODE;
	$scope.Nbid = Nbid;
	$scope.ITEM_NAME = ITEM_NAME;
	$scope.ITEM_DESC = ITEM_DESC;
	
	console.log($scope.value);
	console.log($scope.Nbid);
	console.log($scope.ITEM_NAME);
	console.log($scope.ITEM_DESC);
		
		$http({
			method :"POST",
			url : "/bidCmp",
			data : {
				id 		 : $scope.value,
				bidP     : $scope.Nbid,
				ITEM_NAME: $scope.ITEM_NAME,
				ITEM_DESC: $scope.ITEM_DESC
			}
		}).success(function(response){

			if (response.login == "Success") {
                
				console.log("Its successful");
				window.location.assign('/confirmBidPage');
			}
			}).error(function (err) {
				
			});
	}
//show bid History
$scope.showBidHistory = function(ITEMCODE){
	$scope.value = ITEMCODE;
	
	console.log($scope.value);
	
		
		$http({
			method :"POST",
			url : "/bidHistoryProd",
			data : {
				id 		 : $scope.value
			}
		}).success(function(response){
			if (response.code == 200) {
                
				console.log("Its 1 successful");
				window.location.assign('/bidHistory');
			}
			}).error(function (err) {
				
			});
	}


//
//change cart to directbuy page
$scope.buyNow = function(ITEMCODE, Qty){
	$scope.value = ITEMCODE;
	console.log($scope.value);
		
		$http({
			method :"POST",
			url : "/buyProducts",
			data : {
				item_id : $scope.value
			}
		}).success(function(data){
			if (data.statusCode == 200) {
                window.location.assign('/cart');
			}
			}).error(function (err) {
				
			});
	}
})


