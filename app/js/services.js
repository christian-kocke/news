'use strict';

/* Services */

var newsServices = angular.module('newsServices', ['ngResource']);


newsServices.factory('UserService', function ($http, $log, $rootScope) {

	var userService = {};

	userService.create = function (user) {
		return $http
		.post('/project/RESTapi/public/api/user', user)
		.then(function (res) {
		});
	}

	userService.update = function (data) {
		return $http
		.put('/project/RESTapi/public/api/user/'+$rootScope.currentUser.id, data)
		.then(function (res) {
			return res.data;
		});
	};

	userService.destroy = function (id) {
		return $http
		.delete('/project/RESTapi/public/api/user/'+id)
		.then(function (res) {
		});
	};

	return userService;
});

newsServices.factory('FileService', function ($http, $log, $rootScope, $upload) {

	var fileService = {};

	// When an image is uploaded
	fileService.update = function (files, url) {
		
		var promises = [];

		if (files && files.length) {

			for (var i = 0; i < files.length; i++) {
				var file = files[i];

				var promise = $upload.upload({
					url: url,
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

	};// End update()

	// Get the image path
	fileService.filePath = function (url) {

		return $http
		.get(url).then(function (res) {
			return res.data;
		});

	};// End filePath()

	return fileService;

});// End  FileService


newsServices.factory('ArticleService', function ($http, $log, $rootScope) {

	var articleService = {};

	// Display All/Sorted Articles
	articleService.get = function (categorie) {

		return $http
		.post('/project/RESTapi/public/api/article/display', categorie)
		.then(function (res) {
			return res.data;
		});

	};// End get()

	// Post Article
	articleService.post = function (article) {

		return $http
		.post('/project/RESTapi/public/api/article', article);

	};// End post()

	// Delete Article
	articleService.delete = function (id) {

		return $http
		.delete('/project/RESTapi/public/api/article/'+id);

	};// End delete()

	return articleService;

});// End Service Post/Delete Article (Admin)


newsServices.factory('AuthService', function ($http, Session, $log, $rootScope) {

	var authService = {};

	// Login
	authService.login = function (credentials) {

		return $http
		.post('/project/RESTapi/public/user/login', credentials)
		.then(function (res) {
			Session.create(res.data.id, res.data.user.id, res.data.user.role);
			return res.data.user;
		});

	};// End login()

	// Logout
	authService.logout = function () {
		
		return $http
		.get('/project/RESTapi/public/user/logout')
		.then(function (res) {
			$rootScope.currentUser = null;
			Session.destroy();
		});

	};// End logout()

	// Verification of authentication
	authService.isAuthenticated = function () {
		return !!Session.userId;

	};// End isAuthenticated()

	// Verification authorisations
	authService.isAuthorized = function (authorizedRoles) {
		
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		
		return (authService.isAuthenticated() &&
			authorizedRoles.indexOf(Session.userRole) !== -1);

	};// End isAuthorized ()

	// retrieve the current user if he is authenticated
	authService.retrieveUser = function () {
		
		return $http
		.get('/project/RESTapi/public/api/user')
		.then(function (res) {
			Session.create(res.data.id, res.data.user.id, res.data.user.role);
			return res.data.user;
		}, function () {
			return null;
		});

	}// End retrieveUser

	authService.checkPassword = function (password) {
		return $http
		.post('/project/RESTapi/public/api/user/passwordCheck', password)
		.then(function (res) {
			return !!res.data;
		}, function () {
			return false;
		});
	}

	return authService;

});// End AuthService


newsServices.factory('Session', function () {

	var Session = {};

	Session.create = function (sessionId, userId, userRole) {
		
		Session.id = sessionId;
		Session.userId = userId;
		Session.userRole = userRole;

	};// End create()

	Session.destroy = function () {

		Session.id = null;
		Session.userId = null;
		Session.userRole = null;

	};// End destroy()

	return Session;

});// End Session


newsServices.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS, FILE_EVENTS, ARTICLE_EVENTS, USER_EVENTS) {

	return {

		responseError: function (response) { 

			$rootScope.$broadcast({
				401: AUTH_EVENTS.notAuthenticated,
				403: AUTH_EVENTS.notAuthorized,
				419: AUTH_EVENTS.sessionTimeout,
				440: AUTH_EVENTS.sessionTimeout,
				441: FILE_EVENTS.uploadFailed,
				442: FILE_EVENTS.getFailed,
				450: ARTICLE_EVENTS.postFailed,
				451: ARTICLE_EVENTS.selectFailed,
				452: ARTICLE_EVENTS.deleteFailed,
				460: USER_EVENTS.passwordFailed,
				461: USER_EVENTS.updateFailed,
				462: USER_EVENTS.deleteFailed
			}[response.status], response);

			return $q.reject(response);
		}// End responseError

	};// End Return

});// End AuthInterceptor


newsServices.factory('AuthResolver', function ($q, $rootScope, $location, $log) {
	return {

		resolve: function () {

			var deferred = $q.defer();
			var unwatch = $rootScope.$watch('currentUser', function (currentUser) {

				if (angular.isDefined(currentUser)) {
					
					if (currentUser) {
						$log.log("currentUser not null");
						deferred.resolve(currentUser);
					} else {
						$log.log("currentUser null");
						deferred.reject();
						$location.path('/');
					}

					unwatch();
				}

			});// End watch()

			return deferred.promise;
		}// End resolve

	};// End return

});// End AuthResolver


newsServices.factory('SessionResolver', function ($q, $rootScope, $location, $log, Session) {
	
	return {
		
		resolve: function () {
			
			var def = $q.defer();
			return $rootScope.deferred.promise.then(function () {
				def.resolve();
				$rootScope.$broadcast('$routeChangeStart');
				return def.promise;

			});// End return

		}// End resolve

	};// End return

});// End SessionResolver