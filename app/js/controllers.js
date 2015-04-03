'use strict';

/* Controllers */

var newsControllers = angular.module('newsControllers', []);

newsControllers.controller('AuthCtrl',  ['$scope', '$route', '$routeParams', '$location', '$log', '$http',
  function($scope, $route, $routeParams, $location, $log, $http) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.login = function(user) {
      	$http.post("/project/RESTapi/public/index.php", {test: "test"}).success(function(data) {
      	$log.log(data);
      });
    };
  }]);
