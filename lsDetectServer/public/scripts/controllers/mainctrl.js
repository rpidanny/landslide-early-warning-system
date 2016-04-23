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

app.controller('loginController', ['$scope', function($scope){
}]);

app.controller('signupController', ['$scope', '$http', function($scope, $http){
	$scope.submitUser = function(user){
		$http.post('/user',{user:user}).success(function(response){
			alert('user registered successfully');
		}).error(function(err){
                    $scope.error = err;
                });
	}
}]);
app.controller('dashboardController', function($scope){
    
});