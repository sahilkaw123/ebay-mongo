var app = angular.module("product", []);

app.controller('mainController',function ($scope, $http){ 
	window.onload = function(){
		$http({
			method :"GET",
			url : "/getMyProducts",
			data : {
				
			}
		}).success(function(response){
			$scope.myResult = response.results.rslt;
			//$scope.rowCount= response.rowcount;
			console.log($scope.myResult.rslt);
			//console.log($scope.rowCount);
		});
	};
	
	$scope.showDetail = function(ITEMCODE){
		
		$scope.value = ITEMCODE;
		console.log($scope.value);
			
			$http({
				method :"POST",
				url : "/detailofProducts",
				data : {
					id : $scope.value
				}
			}).success(function(response){
				if (response.code == 200) {
					
	                window.location.assign('/detail');
				}
				}).error(function (err) {
					
				});
		}
	
	$scope.showBid = function(ITEMCODE){
		
		$scope.value = ITEMCODE;
		console.log($scope.value);
			
			$http({
				method :"POST",
				url : "/detailofBidProducts",
				data : {
					id : $scope.value
				}
			}).success(function(response){
				if (response.code == 200) {

					window.location.assign('/bid');
				}
			}).error(function (err) {

			});
		}

});

