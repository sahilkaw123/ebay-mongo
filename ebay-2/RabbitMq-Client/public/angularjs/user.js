var app = angular.module("signin", []);
    
app.controller('loginCtrl', function ($scope, $http) {
     //alert('in controller signup');

        $scope.submit = function () {
            console.log("SAHIL");
            $http({
                method: "POST",
                url: '/checksignin',
                data: {
                    username: $scope.username,
                    password: $scope.password
                }
            }).success(function(response) {
                if (response.login == "Success") {
                    window.location.assign('/homepage');
                  // console.log("SAHIL");
                }
                else {

                        $scope.rowcount = true;
                        console.log($scope.rowcount);
                }
            }).error(function (err) {
                
            });
        }
    })


app.controller('signupCtrl', function ($scope, $http) {
        $scope.registerup = function () {
       console.log($scope.email);
       console.log($scope.phone);
       console.log($scope.firstname);
       console.log($scope.lastname);
       
       
	//console.log("SAHIL");
           $http({
                method: "POST",
                url: '/afterSignUp',
                data: {
                    
                    password: $scope.password,
                    email: $scope.email,
                    phone: $scope.phone,
                    firstname: $scope.firstname,
                    lastname: $scope.lastname
                   
           
                }
            }).success(function (response) {
            	if (response.signup == "success") {
                    console.log("DEDE");
                    window.location.assign('/success');

                  // console.log("SAHIL");
                }
            	else{
            		if (response.signup == "fail") {
                        console.log("DEDE1");
                        window.location.assign('/exists');
                      // console.log("SAHIL");
                    }
            	}
            }).error(function (err) {
               
            });
        };
    });