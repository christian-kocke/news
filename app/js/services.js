'use strict';

/* Services */

var newsServices = angular.module('newsServices', ['ngResource']);

newsServices.factory('FileService', function ($http, $log, $rootScope, $upload) {

	var fileService = {};

	fileService.update = function (files) {
		var promises = [];
		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				console.log(file);
				var promise = $upload.upload({
					url: '/project/RESTapi/public/user/setPicture',
					headers: {
						nom: file.name
					},
					file: file
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
				}).success(function (data, status, headers, config) {
					console.log('file ' + config.file.name + ' uploaded. Response: ' + data);
					return data;
				});
				promises.push(promise);
			}
		}
		return promises;
	};

	fileService.filePath = function () {
		return $http
		.get('/project/RESTapi/public/user/getPicture').then(function (res) {
			return res.data;
		});
	};
	return fileService;
});

// Service Post/Delete Article (Admin)
newsServices.factory('ArticleService', function ($http, $log, $rootScope) {

	var articleService = {};

	// Post Article
	articleService.post = function (article) {
		return $http
		.post('/project/RESTapi/public/api/article', article);
	};

	// Delete Article
	articleService.delete = function (id) {
		return $http
		.delete('/project/RESTapi/public/api/article/:id', {id: id});
	};

	return articleService;
});// End Service Post/Delete Article (Admin)

newsServices.factory('AuthService', function ($http, Session, $log, $rootScope) {

	var authService = {};

	authService.login = function (credentials) {

		return $http
		.post('/project/RESTapi/public/user/login', credentials)
		.then(function (res) {
			Session.create(res.data.id, res.data.user.id, res.data.user.role);
			return res.data.user;
		});
	};

	authService.logout = function () {
		return $http
		.get('/project/RESTapi/public/user/logout')
		.then(function (res) {
			Session.destroy();
		});
	};

	authService.isAuthenticated = function () {
		return !!Session.userId;
	};

	authService.isAuthorized = function (authorizedRoles) {

		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		
		return (authService.isAuthenticated() &&
			authorizedRoles.indexOf(Session.userRole) !== -1);
	};

	authService.retrieveUser = function () {

		return $http
		.get('/project/RESTapi/public/api/user')
		.then(function (res) {
			Session.create(res.data.id, res.data.user.id, res.data.user.role);
			return res.data.user;
		},
		function () {
			return null;
		});
	}

	return authService;
});


newsServices.factory('Session', function () {

	var Session = {};

	Session.create = function (sessionId, userId, userRole) {
		Session.id = sessionId;
		Session.userId = userId;
		Session.userRole = userRole;
	};
	Session.destroy = function () {
		Session.id = null;
		Session.userId = null;
		Session.userRole = null;
	};

	return Session;

});

newsServices.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS, FILE_EVENTS, ARTICLE_EVENTS) {

	return {
		responseError: function (response) { 

			$rootScope.$broadcast({
				401: AUTH_EVENTS.notAuthenticated,
				403: AUTH_EVENTS.notAuthorized,
				419: AUTH_EVENTS.sessionTimeout,
				440: AUTH_EVENTS.sessionTimeout,
				441: FILE_EVENTS.uploadFailed,
				450: ARTICLE_EVENTS.postFailed
			}[response.status], response);
			return $q.reject(response);
		}
	};
});



newsServices.factory('AuthResolver', function ($q, $rootScope, $location, $log) {
	return {
		resolve: function () {
			var deferred = $q.defer();
			var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
				if (angular.isDefined(currentUser)) {
					if (currentUser) {
						deferred.resolve(currentUser);
					} else {
						$log.log("currentUser null");
						deferred.reject();
						$location.path('/');
					}
					unwatch();
				}
			});
			return deferred.promise;
		}
	};
});

newsServices.factory('SessionResolver', function ($q, $rootScope, $location, $log, Session) {
	return {
		resolve: function () {
			var def = $q.defer();
			return $rootScope.deferred.promise.then(function () {
				$log.log(Session);
				def.resolve();
				$rootScope.$broadcast('$routeChangeStart');
				return def.promise;
			});
			
		}
	};
});