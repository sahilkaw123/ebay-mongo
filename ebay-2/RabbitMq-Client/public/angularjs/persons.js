var app = angular.module("person", []);

app.controller('persController',function ($scope, $http){ 
	
	//$scope.Now = function(ITEMCODE){
	//	$scope.value = ITEMCODE;
	//	console.log($scope.value);
	window.onload = function(){
		
		$http({
			method :"GET",
			url : "/personDetail",
			data : {
				
			}
		}).success(function(response){
			$scope.newResult1 = response.result.rslt;

			console.log($scope.newResult1);

			//$scope.ROW_COUNT1= response.rowcount;
			$scope.Contact = $scope.newResult1[0].PHONE;
			console.log($scope.Contact);
			var x = $scope.newResult1[0].Birthday.toString();
			var birth = x.substring(0,10);
			$scope.Birth = birth;
			$scope.Mem = birth;
			var x = $scope.newResult1[0].JOINING.toString();
			var birth1 = x.substring(0,10);
			$scope.Mem = birth1;
			
			$scope.Email = $scope.newResult1[0].EMAIL;
			//console.log($scope.BID_PRICE);
		});
	
}; 



//change cart to directbuy page
$scope.EditProf = function(Contact, Birth, Email){
	$scope.value = Contact;
	console.log($scope.value);
	$scope.birth = Birth;
	console.log($scope.birth);
	$scope.Email = Email;	
	console.log($scope.Email);
		$http({
			method :"POST",
			url : "/updatePerson",
			data : {
				contact : $scope.value,
				birth   : $scope.birth,
				email   : $scope.Email
				
			}
		}).success(function(response){
			if (response.code == 200) {
                window.location.assign('/person');
			}
			}).error(function (err) {
				
			});
	}
})


