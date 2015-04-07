'use strict';

/* Controllers */

var newsControllers = angular.module('newsControllers', []);

newsControllers.controller('ProfilCtrl', ['$http', '$log', '$scope', function($http,$log,$scope) {

}]);


newsControllers.controller('ApplicationController', function ($scope, USER_ROLES, AuthService) {

	$scope.currentUser = null;
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;

	$scope.setCurrentUser = function (user) {
		$scope.currentUser = user;
	};
})




newsControllers.controller('NewsCtrl', ['$scope', '$http', '$log', function($scope,$http,$log) {
	
	$scope.showArticle = false;
	$http.post('/project/app/js/posts.json').success(function(response) {
		$log.log(response);
		$scope.articles = response;
	});
	$scope.doClick = function(id) {
		$scope.currentArticle = $scope.articles[id-1];
		$scope.showArticle = !$scope.showArticle;
	};
}]);

newsControllers.controller('AuthCtrl', function($scope, $rootScope, AUTH_EVENTS, AuthService) {

	$scope.credentials = {
		email: '',
		password: ''
	};

	$scope.login = function (credentials) {
		AuthService.login(credentials).then(function (user) {
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			$scope.setCurrentUser(user);
		}, function () {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});
	};
});

