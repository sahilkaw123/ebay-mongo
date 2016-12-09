var app = angular.module("sell", ['ngStorage']);

app.controller('sellCtrl',function ($scope, $localStorage, $http){
	
	
	$scope.save = function(code){
		
		console.log(code);
	$localStorage.message = code;	
	};

	$scope.condition1 ={
			data: [{
					cond: 'New',
					name: 'New'
					}, {
					cond: 'Manufacturer Refurbished',
					name: 'Manufacturer Refurbished'
					},{
					cond: 'Seller Refurbished',
					name: 'Seller Refurbished'
					},{
					cond: 'Used',
					name: 'Used'
					},{
					cond: 'For Parts or Not working',
					name: 'For Parts or Not working'
					}]
					};       
	


	$scope.duration1 = {
					data: [{
							days: '4 days',
							name: '4 days'
							},{
							days: '7 days',
							name: '7 days'
							},{
							days: '30 days',
							name: '30 days'
							}]
							};
	
	$scope.category1 = {
			data: [{
					days: 'FICTION',
					name: 'FICTION'
					},{
					days: 'NON-FICTION',
					name: 'NON-FICTION'
					},{
					days: 'LAPTOPS',
					name: 'LAPTOPS'
					},{
					days: 'LED - TV',
					name: 'LED - TV'
					},{
					days: 'PERFUMES',
					name: 'PERFUMES'
					},{
					days: 'SHOES',
					name: 'SHOES'
					},{
					days: 'JEWELLERY',
					name: 'JEWELLERY'
					},{
					days: 'UTENSILS',
					name: 'UTENSILS'
					}]
					};
	
	$scope.groupName1 = {
			data: [{
					days: 'BOOKS',
					name: 'BOOKS'
					},{
					days: 'ELECTRONICS',
					name: 'ELECTRONICS'
					},{
					days: 'MENS-FASHION',
					name: 'MENS-FASHION'
					},{
					days: 'LADIES-FASHION',
					name: 'LADIES-FASHION'
					},{
					days: 'COSMETICS',
					name: 'COSMETICS'
					},{
					days: 'KITCHEN',
					name: 'KITCHEN'
					}]
					};
	
	//$scope.Now = function(ITEMCODE){
	//	$scope.value = ITEMCODE;
	//	console.log($scope.value);

	$scope.addProd = function() {
        var BID = $localStorage.message;
        var category = $scope.category;
        var Group_Name = $scope.groupName;
        var COND = $scope.condition;
        var ITEM_NAME = $scope.title;
        var ITEM_PRICE = $scope.startingP;
        var ITEM_DESC = $scope.detail;
        var ITEM_QTY = $scope.qty;
        var min_price = $scope.startingP;
        console.log(BID);
        console.log(category);
        console.log(Group_Name);
        console.log(ITEM_DESC);
        console.log(COND);
        console.log(ITEM_NAME);
        console.log(ITEM_PRICE);
        console.log(ITEM_QTY);
        $http({
			method :"POST",
			url : "/insertProduct",
			data : {
				BID 	   : $localStorage.message,
				category   : $scope.category,
				Group_Name : $scope.groupName,
				COND       : $scope.condition,
				ITEM_NAME  : $scope.title,
				ITEM_PRICE : $scope.startingP,
				ITEM_DESC  : $scope.detail,
				ITEM_QTY   : $scope.qty,
				min_price  : $scope.startingP
			}
		}).success(function(response){
			if (response.code == 200) {
                
				console.log("Its successful");
				window.location.assign('/list');
			}
			}).error(function (err) {
				
			});
        
    };

$scope.placeBid = function(ITEMCODE, bidP, ITEM_NAME, ITEM_DESC){
	$scope.value = ITEMCODE;
	$scope.bidP = bidP;
	$scope.ITEM_NAME = ITEM_NAME;
	$scope.ITEM_DESC = ITEM_DESC;
	
	console.log($scope.value);
	console.log($scope.bidP);
		
		$http({
			method :"POST",
			url : "/bidCmp",
			data : {
				id 		 : $scope.value,
				bidP     : $scope.bidP,
				ITEM_NAME: $scope.ITEM_NAME,
				ITEM_DESC: $scope.ITEM_DESC
			}
		}).success(function(data){
			if (data.statusCode == 200) {
                
				console.log("Its successful");
				window.location.assign('/confirmBidPage');
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


