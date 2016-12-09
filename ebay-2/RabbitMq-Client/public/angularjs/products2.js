var app = angular.module("product", []);

app.controller('mainController',function ($scope, $http){ 
	window.onload = function(){
		$http({
			method :"GET",
			url : "/getMyProducts",
			data : {
				
			}
		}).success(function(response){
			$scope.myResult = response.jsonParse;
			$scope.rowCount= response.rowcount;
			console.log($scope.myResult);
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
			}).success(function(data){
				if (data.statusCode == 200) {
					
	                window.location.assign('/detail');
				}
				}).error(function (err) {
					
				});
		}	
	
});

