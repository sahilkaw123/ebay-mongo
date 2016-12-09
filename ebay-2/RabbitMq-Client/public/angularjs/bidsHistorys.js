var app = angular.module("bidH", []);

app.controller('bidHController',function ($scope, $http){ 
	
	//$scope.Now = function(ITEMCODE){
	//	$scope.value = ITEMCODE;
	//	console.log($scope.value);
	window.onload = function(){
		
		$http({
			method :"GET",
			url : "/historyProduct",
			data : {
				
			}
		}).success(function(response){
			$scope.newResult = response.result;
			$scope.ROW_COUNT= response.length;
			$scope.date = response.result.currDate;
			//$scope.time = response.time1;
			console.log($scope.newResult);
			console.log($scope.date);
		});
	
};
});

//$scope.placeBid = function(ITEMCODE, BidP){
