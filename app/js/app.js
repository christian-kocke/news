'use strict';

/* App Module */

var newsApp = angular.module('newsApp', [
  'ngRoute',
  'newsControllers',
  'newsServices',
  ]);

newsApp.config(['$routeProvider', 'USER_ROLES', '$locationProvider',
  function($routeProvider, USER_ROLES, $locationProvider) {

    $routeProvider.
    when('/admin', {
      templateUrl: '/project/app/partials/admin.html',
      data: {
        authorizedRoles: [USER_ROLES.admin]
      },
      resolve: {
        auth: function resolveAuthentication(AuthResolver) { 
          return AuthResolver.resolve();
        }
      }
    }).
    when('/', {
      templateUrl: '/project/app/partials/registration.html',
      url: '/protected',
    }).
    when('/profil', {
      templateUrl: 'partials/userProfil.html',
      controller: 'ProfilCtrl',
      data: {
        authorizedRoles: [USER_ROLES.admin, USER_ROLES.client]
      },
      resolve: {
        auth: function resolveAuthentication(AuthResolver) { 
          return AuthResolver.resolve();
        }
      },
    }).
    when('/client', {
      templateUrl: '/project/app/partials/client-news-feed.html',
      controller: 'NewsCtrl',
      data: {
        authorizedRoles: [USER_ROLES.client, USER_ROLES.admin]
      }
    }).
    otherwise({
      redirectTo: '/',
    });

    $locationProvider.html5Mode(false);
  }
  

]).run(function ($rootScope, AUTH_EVENTS, AuthService, $log, Session) {
    
    AuthService.retrieveUser().then(function (user) {
      $rootScope.currentUser = user;
    });

    $rootScope.$on('$routeChangeStart', function (event, next) {

      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });
});


newsApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
    ]);
});


newsApp.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
}).constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  client: 'client'
});
