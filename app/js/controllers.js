'use strict';

/* Controllers */

var newsControllers = angular.module('newsControllers', []);


newsControllers.controller('NewsCtrl', ['$scope', '$http', '$log', function($scope,$http,$log) {
	$scope.showArticle = false;
  $http.post('/News/app/js/posts.json').success(function(response) {
		$log.log(response);
		$scope.articles = response;
	});
  $scope.doClick = function(id) {
    $scope.currentArticle = $scope.articles[id-1];
    $scope.showArticle = !$scope.showArticle;
  };
}]);

newsControllers.controller('AuthCtrl',  ['$scope', '$route', '$routeParams', '$location', '$log', 'User', '$http',
	function($scope, $route, $routeParams, $location, $log, User, $http) {

		$scope.loggedIn = false;

		$scope.login = function(user) {

			var authentication = User.login({action: "login"}, {email: user.email, password: user.password}).$promise;

			authentication.then(function(response) {

				$scope.loggedIn = (response[0] === "1");

				if($scope.loggedIn) {
					User.get({action: "token"}).$promise.then(function(response) {
						$scope.loggedIn = (response[0] === "1");	
					});
				}

			});
		};

		$log.log($scope.loggedIn);
	}
]);

