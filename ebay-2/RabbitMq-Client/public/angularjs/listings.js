var app = angular.module("list", []);

app.controller('listController',function ($scope, $http){ 
	
	//$scope.Now = function(ITEMCODE){
	//	$scope.value = ITEMCODE;
	//	console.log($scope.value);
	window.onload = function(){
		
		$http({
			method :"GET",
			url : "/listDetail",
			data : {
				
			}
		}).success(function(response){
			$scope.newResult1 = response.result.rslt;
			console.log($scope.newResult1);
			//$scope.ROW_COUNT1= response.rowcount;
			$scope.Name = $scope.newResult1[0].ITEM_NAME;
			$scope.Desc = $scope.newResult1[0].ITEM_DESC;
			$scope.Code = $scope.newResult1[0].ITEM_CODE;
			$scope.Price = $scope.newResult1[0].ITEM_PRICE;
			$scope.Qty = $scope.newResult1[0].ITEM_QTY;
			$scope.cond = $scope.newResult1[0].COND;
			$scope.grp = $scope.newResult1[0].Group_Name;
			$scope.cat = $scope.newResult1[0].category;
			//var BID = $scope.newResult1[0].BID;
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
		}).success(function(data){
			if (data.statusCode == 200) {
                window.location.assign('/person');
			}
			}).error(function (err) {
				
			});
	}
})


