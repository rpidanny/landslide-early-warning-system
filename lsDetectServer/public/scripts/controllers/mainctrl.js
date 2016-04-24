var app = angular.module('mainModule', [
    'ui.bootstrap',
    'ngResource',
    'ui.router',
    'uiGmapgoogle-maps'
]);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: '/views/login.html',
                controller: 'loginController'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: '/views/signup.html',
                controller: 'signupController'
            }).state('dashboard', {
                url: '/dashboard',
                templateUrl: '/views/dashboard.html',
                controller: 'dashboardController'
            });
        $urlRouterProvider.otherwise("/");
    }
]);

app.controller('loginController', ['$scope',
    function($scope) {}
]);

app.controller('signupController', ['$scope', '$http',
    function($scope, $http) {
        $scope.submitUser = function(user) {
            $http.post('/user', {
                user: user
            }).success(function(response) {
                alert('user registered successfully');
            }).error(function(err) {
                $scope.error = err;
            });
        }
    }
]);
app.controller('dashboardController', function($scope) {
    var socket = io.connect('http://192.168.1.54/');
    socket.on('sensor data', function(data) {
        $scope.$apply(function() {
            $scope.currentSensor = data;
        });
    console.log(data);
    });
    $scope.map = {
        center: {
            latitude: 28.3949,
            longitude: 84.1240
        },
        zoom: 7,
        bounds: {}
    };
    $scope.options = {
        scrollwheel: false
    };
    $scope.marker = [{
        latitude: 27.7172,
        longitude: 85.3240,
        title: "m0",
        id: 0,
        options: {
            labelClass: 'marker_labels',
            labelAnchor: '12 60',
            labelContent: 'title'
        },
    }, {
        latitude: 27.6644,
        longitude: 85.3188,
        title: "m1",
        id: 1,
        options: {
            labelClass: 'marker_labels',
            labelAnchor: '12 60',
            labelContent: 'title'
        },
    }];
});