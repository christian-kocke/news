'use strict';

/* Controllers */

var newsControllers = angular.module('newsControllers', ['angularFileUpload']);

newsControllers.controller('ArticleCtrl', function ($scope, $upload, $http, ArticleService, FileService, FILE_EVENTS, ARTICLE_EVENTS, $rootScope) {
	
	$scope.article = {};

	// Waiting for a Drop
	$scope.$watch('files', function () {
		$scope.upload();
	});

	// When Image is Dropped
	$scope.upload = function () {
		// Get Image Path
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

	// When Form is Submitted
	$scope.submit = function() {

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

		// Reset Form After Submitting
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
});

newsControllers.controller('ApplicationController', function ($scope, USER_ROLES, AuthService, $location, $log, Session) {

	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;
});

newsControllers.controller('NewsCtrl', function ($scope, $http, $log, ArticleService, ARTICLE_EVENTS) {
	
	$scope.showArticle = false;

	$scope.display = function () {
		ArticleService.get().then(function (res) {
			for(var i = 0; i < res.length; i++){
				res[i].img_path = "/project/app/imgDrop/"+res[i].img_path;
			}
			$scope.articles = res;
		});
	};
	
	$scope.readMore = function(id) {
		angular.forEach($scope.articles, function(article) {
			if(article.id === id) {
				$scope.currentArticle = article;
				$scope.showArticle = true;
			}
		});
	};

	$scope.closeArticle = function() {
		$scope.showArticle = false;
	};

	// When Delete Button is Clicked
	$scope.delete = function(id) {
		$log.log(id);
		ArticleService.delete(id).then(function (res) {
			$rootScope.$broadcast(ARTICLE_EVENTS.deleteSuccess);
		}, function () {
			$rootScope.$broadcast(ARTICLE_EVENTS.deleteFailed);
		});
	};
});

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


