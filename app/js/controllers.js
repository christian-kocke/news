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

	};// End submit()

});// End ArticleCtrl

newsControllers.controller('ProfilCtrl', function ($scope, $http, FileService, $log) {

	$scope.imgIsEnable = false;
	$scope.imgSrc = null;

	// Watch for any dropped element
	$scope.$watch('files', function () {
		
		$scope.upload();

	});

	// When an element is dropped
	$scope.upload = function () {
		
		angular.forEach(FileService.update($scope.files, "/project/RESTapi/public/user/setPicture"), function (promise) {
			promise.then(function (res) {
				FileService.filePath().then(function (path) {
					$scope.imgIsEnable = !!path;
					$scope.imgSrc = path;
				});
			});
		});

	};// End upload()

});// End ProfilCtrl

newsControllers.controller('ApplicationController', function ($scope, USER_ROLES, AuthService, $location, $log, Session) {

	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;

});// End ApplicationController

newsControllers.controller('NewsCtrl', function ($scope, $http, $log, ArticleService, ARTICLE_EVENTS, $rootScope, $timeout, $routeParams) {
	
	$scope.showArticle = false;

	// Display All the Articles
	$scope.display = function () {
		
		$scope.categorie = $routeParams.categorie;

		ArticleService.get($routeParams).then(function (res) {
			
			for(var i = 0; i < res.length; i++){
				res[i].img_path = "/project/app/imgDrop/"+res[i].img_path;
			}

			$scope.articles = res;

		});

	};// End Display()
	
	// Display the Clicked Article in Full Screen
	$scope.readMore = function(id) {
		
		angular.forEach($scope.articles, function(article) {
			if(article.id === id) {
				$scope.currentArticle = article;
				$scope.showArticle = true;
			}
		});

	};// End readMore()

	// Close Full Screen Article
	$scope.closeArticle = function() {

		$scope.showArticle = false;

	};// End closeArticle()

	// Delete Article when Button is Clicked
	$scope.delete = function(id) {
		
		$scope.showArticle = false;

		ArticleService.delete(id).then(function () {
			$rootScope.$broadcast(ARTICLE_EVENTS.deleteSuccess);
			$rootScope.$on(ARTICLE_EVENTS.deleteSuccess, $scope.display());
		}, function () {
			$rootScope.$broadcast(ARTICLE_EVENTS.deleteFailed);
		});

	};// End delete()

});// End NewsCtrl

newsControllers.controller('AuthCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {

	$scope.credentials = {
		email: '',
		password: ''
	};

	// When user try to log in
	$scope.login = function (credentials) {
		
		AuthService.login(credentials).then(function (user) {
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			$rootScope.currentUser = user;
		}, function () {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});

	};// End login()

	// When user try to log out
	$scope.logout = function () {
		
		AuthService.logout().then(function (res) {
			$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
			$rootScope.currentUser = null;
		});

	};// End logout()

});// End AuthCtrl