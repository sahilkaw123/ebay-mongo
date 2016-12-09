var app = angular.module("profile", []);

app.controller('profController',function ($scope, $http){ 
	
	//$scope.Now = function(ITEMCODE){
	//	$scope.value = ITEMCODE;
	//	console.log($scope.value);
	window.onload = function(){
		
		$http({
			method :"GET",
			url : "/profileDetail",
			data : {
				
			}
		}).success(function(response){
			$scope.newResult1 = response.result.rslt1;
			$scope.newResult2 = response.result.rslt2;
			$scope.newResult3 = response.result.rslt3;
			$scope.newResult4 = response.result.rslt4;
			$scope.newResult5 = response.result.rslt5;
			$scope.newResult6 = response.result.rslt6;
			$scope.newResult7 = response.result.rslt7;
			$scope.ROW_COUNT1= response.result.len1;
			//console.log("CCC" + $scope.ROW_COUNT1);
			$scope.ROW_COUNT2= response.result.len2;
			$scope.ROW_COUNT3= response.result.len3;
			$scope.ROW_COUNT4= response.result.len4;
			$scope.ROW_COUNT5= response.result.len5;
			$scope.ROW_COUNT6= response.result.len6;
			$scope.ROW_COUNT7= response.result.len7;
			//$scope.BID_PRICE = response.jsonMaxP[0].M_Price;
			//console.log($scope.ROW_COUNT1);
			//console.log($scope.ROW_COUNT2);
			//console.log($scope.BID_PRICE);
		});
	
}; 

//$scope.placeBid = function(ITEMCODE, BidP){
$scope.profile = function(username){
	$scope.value = username;
	console.log($scope.value);
		
		$http({
			method :"POST",
			url : "/fetchProfile",
			data : {
				username : $scope.value
				
			}
		}).success(function(response){
			 window.location.assign('/person');
			
			
		});
	
}; 

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


