var app = angular.module('mainModule', [
	'ui.bootstrap', 
	'ngResource', 
	'ui.router', 
	]);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('login',{
				url: '/',
				templateUrl: '/views/login.html',
				controller: 'loginController'
			})
			.state('signup',{
				url: '/signup',
				templateUrl: '/views/signup.html',
				controller: 'signupController'
			}).state('dashboard',{
                            url: '/dashboard',
                            templateUrl: '/views/dashboard.html',
                            controller: 'dashboardController'
                        });
		$urlRouterProvider.otherwise("/");
}]);

app.controller('loginController', ['$scope', '$http', '$location', function($scope, $http, $location){
	$scope.login = function(user) {
		$http.post('/user/login',user).success(function(response){
			localStorage.name = response.user_data.name;
			localStorage.email = response.user_data.email;
			localStorage.location = response.user_data.location;
			localStorage.phone = response.user_data.phone;
			alert(response.message);
			$location.path('/dashboard');
		}).error(function(err){
			alert(err.message);
		});
	}
}]);

app.controller('signupController', ['$scope', '$http', function($scope, $http){
	$scope.submitUser = function(user){
		$http.post('/user',{user:user}).success(function(response){
			alert('user registered successfully');
		}).error(function(err){
			console.log(err);
            $scope.error = err;
            alert(err.message);
        });
	}
}]);
app.controller('dashboardController', function($scope){
    
});