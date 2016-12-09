var app = angular.module("order", []);
    
app.controller('orderController', function ($scope, $http) {

window.onload = function(){
			
			$http({
				method :"GET",
				url : "/checkOutProducts",
				data : {
					
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



}); // controller ends

/*
$scope.Confirm = function(){
	
	
	$http({
		method :"POST",
		url : "/creditcard",
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