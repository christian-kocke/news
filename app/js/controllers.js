'use strict';

/* Controllers */

var newsControllers = angular.module('newsControllers', []);

newsControllers.controller('AuthCtrl',  ['$scope', '$route', '$routeParams', '$location', '$log', 'User',
  function($scope, $route, $routeParams, $location, $log, User) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.login = function(user) {
    	$scope.words = User.login();
    };
  }]);
