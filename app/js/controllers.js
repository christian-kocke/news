'use strict';

/* Controllers */

var newsControllers = angular.module('newsControllers', ['angularFileUpload', 'ngToast']);

newsControllers.controller('RegistrarCtrl', function (UserService, $rootScope, $scope, $log, $route, $location, USER_EVENTS) {

	$scope.confirm = false;

	$scope.register = function (user) {
		UserService.create(user).then(function (res) {
			$rootScope.$broadcast(USER_EVENTS.registrationSuccess);
		}, function () {
			$rootScope.$broadcast(USER_EVENTS.registrationFailed);
		});
	};

	$scope.checkPassword = function (user) {
		$scope.confirm = user.password === user.password_confirmation;
		$log.log($scope.confirm);
	};
});

newsControllers.controller('ArticleCtrl', function ($scope, $log, $upload, $http, ArticleService, FileService, FILE_EVENTS, ARTICLE_EVENTS, $rootScope) {
	
	$scope.article = {};
	$scope.imgIsEnable = false;

	// Waiting for a Drop
	$scope.$watch('files', function () {
		$scope.upload();
	});

	// When Image is Dropped
	$scope.upload = function () {
		
		// Get Image Path
		angular.forEach(FileService.update($scope.files, '/project/RESTapi/public/api/article/setPicture'), function (promise) {
			promise.then(function (res) {
				$scope.imgIsEnable = !!res;
				$scope.fileName = res.data;
				$rootScope.$broadcast(FILE_EVENTS.uploadSuccess);
			}, function () {
				$rootScope.$broadcast(FILE_EVENTS.updateFailed);
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

newsControllers.controller('ProfilCtrl', function ($scope, $http, FileService, $route, $log, $rootScope, Session, UserService, USER_EVENTS, FILE_EVENTS) {

	$scope.imgIsEnable = false;
	$scope.imgSrc = null;
	$scope.updateLogin = false;

	// Watch for any dropped element
	$scope.$watch('files', function () {
		$scope.upload();
	});

	// When an element is dropped
	$scope.upload = function () {
		angular.forEach(FileService.update($scope.files, "/project/RESTapi/public/user/setPicture"), function (promise) {
			promise.then(function (res) {
				$rootScope.currentUser.img = res.data + '?decache=' + Math.random();
				$rootScope.$broadcast(FILE_EVENTS.uploadSuccess);
			}, function () {
				$rootScope.$broadcast(FILE_EVENTS.updateFailed);
			});
		});

	};// End upload()

	// When user click on his username 
	$scope.showInput = function () {
		$scope.updateLogin = true;
	};

	$scope.loginUpdate = function () {
		$log.log($scope.user);
		UserService.update($scope.user).then(function (res) {
			$rootScope.$broadcast(USER_EVENTS.updateSuccess);
			$scope.updateLogin = false;
		}, function () {
			$rootScope.$broadcast(USER_EVENTS.updateFailed);
		});		
	};

	$scope.updatePassword = function (pwd) {
		UserService.update(pwd).then(function (res) {
			$rootScope.$broadcast(USER_EVENTS.passwordSuccess);
		}, function () {
			$rootScope.$broadcast(USER_EVENTS.passwordFailed);
		});	
	};

});// End ProfilCtrl

newsControllers.controller('ApplicationController', function (ngToast, $scope, USER_ROLES, AuthService, $location, $log, Session, UserService, $rootScope, $route, USER_EVENTS) {

	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;

	$scope.deleteAccount = function () {
		UserService.destroy($rootScope.currentUser.id).then(function (res) {
			$rootScope.currentUser = null;
			Session.destroy();
			$route.reload();
			$rootScope.$broadcast(USER_EVENTS.deleteSuccess);
		}, function () {
			$rootScope.$broadcast(USER_EVENTS.deleteFailed);
		});
	};

});// End ApplicationController

newsControllers.controller('NewsCtrl', function ($scope, $http, $log, ArticleService, ARTICLE_EVENTS, $rootScope, $timeout, $routeParams) {
	
	$scope.showArticle = false;
	// Display All the Articles
	$scope.display = function () {
		$log.log("polling");
		$scope.categorie = $routeParams.categorie;

		ArticleService.get($routeParams).then(function (res) {
			
			for(var i = 0; i < res.length; i++){
				res[i].img_path = res[i].img_path;
			}
			$scope.articles = res;
			$timeout($scope.display, 36000); // data polling every 40 secondes
		}, function () {
			$rootScope.$broadcast(ARTICLE_EVENTS.selectFailed);
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
			$rootScope.$broadcast(ARTICLE_EVENTS.deleteSuccess, $scope.display());
		}, function () {
			$rootScope.$broadcast(ARTICLE_EVENTS.deleteFailed);
		});

	};// End delete()

});// End NewsCtrl

newsControllers.controller('AuthCtrl', function ($scope, $rootScope, $route, AUTH_EVENTS, AuthService) {

	$scope.credentials = {
		email: '',
		password: ''
	};

	// When user try to log in
	$scope.login = function (credentials) {
		
		AuthService.login(credentials).then(function (user) {
			$rootScope.currentUser = user;
			$route.reload();
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
		}, function () {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});

	};// End login()

	// When user try to log out
	$scope.logout = function () {
		AuthService.logout().then(function (res) {
			$route.reload();
			$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
		});

	};// End logout()

});// End AuthCtrl