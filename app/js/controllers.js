'use strict';

/* Controllers */

var newsControllers = angular.module('newsControllers', ['angularFileUpload']);

newsControllers.controller('ProfilCtrl', ["$scope", "$upload", '$http', function ($scope, $upload, $http) {

	$scope.imgIsEnable = false;

	$scope.$watch('files', function () {
		$scope.upload($scope.files);
	});

	$scope.upload = function (files) {
		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				console.log(file);
				$upload.upload({
					url: '/project/RESTapi/public/user/setPicture',
					headers: {
						nom: file.name
					},
					file: file
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' +
						evt.config.file.name);
				}).success(function (data, status, headers, config) {
					console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
				});
			}
		}
	};

	$scope.getPicture = function () {
		$scope.imgSrc = "";
		$http.get('/project/RESTapi/public/user/getPicture').then(function (res) {
			$scope.imgIsEnable = !!res.data;
			$scope.imgSrc = res.data;
		});
		return $scope.imgSrc;
	}
}]);

newsControllers.controller('ApplicationController', function ($scope, USER_ROLES, AuthService, $location, $log, Session) {

	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;
});

newsControllers.controller('NewsCtrl', ['$scope', '$http', '$log', function($scope,$http,$log) {
	$scope.showArticle = false;
	$http.post('/project/app/js/posts.json').success(function(response) {
		$scope.articles = response;
	});
	$scope.doClick = function(id) {
		$scope.currentArticle = $scope.articles[id-1];
		$scope.showArticle = !$scope.showArticle;
	};
}]);

newsControllers.controller('AuthCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {

	$scope.credentials = {
		email: '',
		password: ''
	};

	$scope.login = function (credentials) {
		AuthService.login(credentials).then(function (user) {
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			$rootScope.currentUser = user;
		}, function () {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});
	};

	$scope.logout = function () {
		AuthService.logout().then(function (res) {
			$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
			$rootScope.currentUser = null;
		});
	};
});


