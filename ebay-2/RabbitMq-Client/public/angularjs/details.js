var app = angular.module("detail", []);

app.controller('detailController',function ($scope, $http){ 
	
	//$scope.Now = function(ITEMCODE){
	//	$scope.value = ITEMCODE;
	//	console.log($scope.value);
	window.onload = function(){
		
		$http({
			method :"GET",
			url : "/detailProduct",
			data : {
				
			}
		}).success(function(response){
			$scope.newResult = response.results.rslt;
			//$scope.rowCount= response.rowcount;
			console.log($scope.newResult);
		});
	
}; 

$scope.addCart = function(ITEMCODE, Qty){
	$scope.value = ITEMCODE;
	//$scope.Qty = Qty;
	console.log($scope.value);
	$scope.Qty = parseInt($scope.Qty);
	$scope.Qty = Qty;
	console.log($scope.Qty);
		
		$http({
			method :"POST",
			url : "/addProducts",
			data : {
				item_id : $scope.value,
				Qty     : $scope.Qty
			}
		}).success(function(response){
			if (response.code == "200") {
                
				console.log("Its successful");
				window.location.assign('/cart');
			}
			}).error(function (err) {
				
			});
	}

//change cart to directbuy page
$scope.buyNow = function(ITEMCODE, Qty){
	$scope.value = ITEMCODE
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


