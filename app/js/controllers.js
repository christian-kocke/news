'use strict';

/* Controllers */

var newsControllers = angular.module('newsControllers', ['angularFileUpload']);

newsControllers.controller('ArticleCtrl', function ($scope, $upload, $http, ArticleService, FileService, FILE_EVENTS, ARTICLE_EVENTS, $rootScope) {
	$scope.article = {};

	$scope.$watch('files', function () {
		$scope.upload();
	});

	$scope.upload = function () {
		angular.forEach(FileService.update($scope.files), function (promise) {
			promise.then(function (res) {
				$scope.fileName = res.data;
				FileService.filePath().then(function (path) {
					$scope.imgIsEnable = !!path;
					$scope.imgSrc = path;
				});
			});
		});
	};

	$scope.submit = function() {
		console.log('here');
		// Article Creation (JSON)
		$scope.article = {
			title: $scope.inputs.title,
			content: $scope.inputs.content,
			author_id: $rootScope.currentUser.id,
			img_path: $scope.fileName,
			categorie: $scope.inputs.categories
		};
		console.log($scope.article);

		// Send Article To ArticleService
		ArticleService.post($scope.article).then(function (res) {
			$rootScope.$broadcast(ARTICLE_EVENTS.postSuccess);
		}, function () {
			$rootScope.$broadcast(ARTICLE_EVENTS.postFailed);
		});
		$scope.inputs = "";
		$scope.imgIsEnable = false;
		$scope.addNewsForm.$setPristine();
	};
});

newsControllers.controller('ProfilCtrl', function ($scope, $http, FileService, $log) {

	$scope.imgIsEnable = false;
	$scope.imgSrc = null;

	$scope.$watch('files', function () {
		$scope.upload();
	});

	$scope.upload = function () {
		angular.forEach(FileService.update($scope.files), function (promise) {
			promise.then(function (res) {
				FileService.filePath().then(function (path) {
					$scope.imgIsEnable = !!path;
					$scope.imgSrc = path;
				});
			});
		});
	};

	/*$scope.getPicture = function () {
		$scope.imgSrc = "";
		
	};*/
});

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


