var app = angular.module("placeOrder", []);
    
app.controller('placeController', function ($scope, $http) {

window.onload = function(){
			
			$http({
				method :"GET",
				url : "/updateMoney",
				data : {
					
				}
			}).success(function(response){
				$scope.newResult = response.jsonParse;
				$scope.rowCount= response.rowcount;
				$scope.Cart_Price = response.cart_Price;
				//console.log($scope.newResult);
				console.log($scope.Cart_Price);
				//if (data.statusCode == 200) {
					
	             //   window.location.assign('/confirm');
				//}
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