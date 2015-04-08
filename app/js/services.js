'use strict';

/* Services */

var newsServices = angular.module('newsServices', ['ngResource']);

newsServices.factory('AuthService', function ($http, Session, $log, $rootScope) {

	var authService = {};

	authService.login = function (credentials) {

		return $http
		.post('/project/RESTapi/public/user/login', credentials)
		.then(function (res) {
			Session.create(res.data.id, res.data.user.id, res.data.user.name, "admin");
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
			Session.create(res.data.id, res.data.user.id, res.data.user.name, "admin");
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

	Session.create = function (sessionId, userId, userName, userRole) {
		Session.id = sessionId;
		Session.userId = userId;
		Session.userName = userName;
		Session.userRole = userRole;
	};
	Session.destroy = function () {
		Session.id = null;
		Session.userId = null;
		Session.userName = null;
		Session.userRole = null;
	};

	return Session;

});

newsServices.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {

	return {
		responseError: function (response) { 

			$rootScope.$broadcast({
				401: AUTH_EVENTS.notAuthenticated,
				403: AUTH_EVENTS.notAuthorized,
				419: AUTH_EVENTS.sessionTimeout,
				440: AUTH_EVENTS.sessionTimeout
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