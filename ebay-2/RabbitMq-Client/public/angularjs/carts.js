var app = angular.module("cart", []);
    
app.controller('cartController', function ($scope, $http) {

window.onload = function(){
			
			$http({
				method :"GET",
				url : "/displayProducts",
				data : {
					id : $scope.value
				}
			}).success(function(response){
				$scope.newResult = response.results.rslt;
				//$scope.rowCount= response.rowcount;
				$scope.Cart_Price = response.results.cart_Price;
				$scope.QTYC = response.results.QTYC;
				console.log($scope.QTYC);
				console.log($scope.Cart_Price);
			});
		
	};

$scope.RemoveCartItem = function(ITEMCODE){
		
		$scope.value = ITEMCODE;
		console.log($scope.value);
			
			$http({
				method :"POST",
				url : "/removeProducts",
				data : {
					id : $scope.value
				}
			}).success(function(data){
				if (data.statusCode == 200) {
					
	                window.location.assign('/cart');
				}
				}).error(function (err) {
					
				});
		};	

}); // controller ends

/*
$scope.checkOut = function(){
	
	
	$http({
		method :"POST",
		url : "/checkOut",
		data : {
			
		}
	}).success(function(data){
		if (data.statusCode == 200) {
            
			console.log("Its successful");
			window.location.assign('/cart');
		}
		}).error(function (err) {
			
		});
} // scope.Checkout
}); // controller ends
*/