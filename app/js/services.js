'use strict';

/* Services */

var newsServices = angular.module('newsServices', ['ngResource']);

newsServices.factory('AuthService', function ($http, Session) {

	var authService = {};

	authService.login = function (credentials) {

		return $http
		.post('/project/RESTapi/public/user/login', credentials)
		.then(function (res) {
			Session.create(res.data.id, res.data.user.id, res.data.user.name, "admin");
			return res.data.user;
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
		});
	}

	return authService;
});


newsServices.service('Session', function () {

  this.create = function (sessionId, userId, userName, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userName = userName;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
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


newsServices.factory('AuthResolver', function ($q, $rootScope, $route) {
  return {
    resolve: function () {
      var deferred = $q.defer();
      var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
        if (angular.isDefined(currentUser)) {
          if (currentUser) {
            deferred.resolve(currentUser);
          } else {
            deferred.reject();
            $route.updateParams('/');
          }
          unwatch();
        }
      });
      return deferred.promise;
    }
  };
});