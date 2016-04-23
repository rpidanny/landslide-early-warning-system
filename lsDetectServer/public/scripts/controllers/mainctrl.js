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
			});
		$urlRouterProvider.otherwise("/");
}]);

app.controller('loginController', ['$scope', function($scope){
}]);

app.controller('signupController', ['$scope', '$http', function($scope, $http){
	$scope.submitUser = function(user){
		$http.post('/api/user/submit',{user:user}).success(function(response){
			debugger;
		});
	}
}]);