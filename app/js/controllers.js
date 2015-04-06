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

newsControllers.controller('NewsCtrl', ['$scope', '$http', '$log', function($scope,$http,$log) {
	$scope.showArticle = false;
  $http.post('/News/app/js/posts.json').success(function(response) {
		$log.log(response);
		$scope.articles = response;
	});
  $scope.doClick = function(id) {
    $scope.currentArticle = $scope.articles[id-1];
    $scope.showArticle = true;
  };
  $scope.doClose = function() {
    $scope.showArticle = false;
  };
}]);
