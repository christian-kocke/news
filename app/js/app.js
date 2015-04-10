'use strict';

/* App Module */

var newsApp = angular.module('newsApp', [
  'ngRoute',
  'newsControllers',
  'newsServices',
  ]);

newsApp.config(['$routeProvider', 'USER_ROLES', '$locationProvider',
  function($routeProvider, USER_ROLES, $locationProvider, $rootScope) {

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
      resolve: {
        session: function resolveSession(SessionResolver) {
          return SessionResolver.resolve();
        }
      },
      redirection: ['AuthService', '$log', function (AuthService, $log) {
          if(AuthService.isAuthenticated()){
            return '/client/0';
          }
      }],
    }).
    when('/profil', {
      templateUrl: 'partials/userProfil.html',
      controller: "ProfilCtrl",
      data: {
        authorizedRoles: [USER_ROLES.admin, USER_ROLES.client]
      },
      resolve: {
        auth: function resolveAuthentication(AuthResolver) { 
          return AuthResolver.resolve();
        },
        session: function resolveSession(SessionResolver) {
          return SessionResolver.resolve();
        }
      }
    }).
    when('/client/:categorie', {
      templateUrl: '/project/app/partials/client-news-feed.html',
      controller: 'NewsCtrl',
      data: {
        authorizedRoles: [USER_ROLES.client, USER_ROLES.admin]
      },
      resolve: {
        auth: function resolveAuthentication(AuthResolver) { 
          return AuthResolver.resolve();
        },
        session: function resolveSession(SessionResolver) {
          return SessionResolver.resolve();
        }
      }
    }).
    otherwise({
      redirectTo: '/',
    });

    $locationProvider.html5Mode(false);
  }
  

  ]).run(function ($rootScope, AUTH_EVENTS, ARTICLE_EVENTS, FILE_EVENTS, AuthService, $log, Session, $q, $location, $injector) {
    $rootScope.deferred = $q.defer();

    AuthService.retrieveUser().then(function (user) {
      $rootScope.currentUser = user;
      $rootScope.deferred.resolve();

      $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if(next && next.data){
          var authorizedRoles = next.data.authorizedRoles;
          if (!AuthService.isAuthorized(authorizedRoles)) {
            event.preventDefault();
            if (AuthService.isAuthenticated()) {
              // user is not allowed
              $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            } else {
              // user is not logged in
              $log.log(Session);
              $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
          }
        }
      });
    });

    $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
      if(next && next.$$route){
        var redirectionFunction = next.$$route.redirection;
        if(redirectionFunction){
          var route = $injector.invoke(redirectionFunction);
          $log.log("route : "+route);
          if(route){
            $log.log("redirecting ...");
            $location.path(route);
          }
        }
      }
    });

    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
      $log.log("not authenticated");
    });

    $rootScope.$on(AUTH_EVENTS.notAuthorized, function () {
      $log.log("not authorized");
    });

    $rootScope.$on(ARTICLE_EVENTS.postSuccess, function () {
      $log.log("post success");
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
  }).constant('ARTICLE_EVENTS', {
    postSuccess: 'post-article-success',
    postFailed: 'post-article-failed',
    deleteSuccess: 'delete-article-success',
    deleteFailed: 'delete-article-failed',
    selectSuccess: 'select-article-success',
    selectFailed: 'select-article-failed'
  }).constant('FILE_EVENTS', {
    uploadSuccess: 'upload-file-success',
    uploadFailed: 'upload-file-failed',
    deleteSuccess: 'delete-file-success',
    deleteFailed: 'delete-file-failed'
  });
