'use strict';

/* App Module */

var newsApp = angular.module('newsApp', [
  'ngRoute',
  'newsControllers',
  'newsServices'
  ]);

newsApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/admin', {
      templateUrl: 'partials/admin.html'
    }).
    when('/', {
      templateUrl: 'partials/registration.html'
    }).
    when('/profil', {
      templateUrl: 'partials/userProfil.html'
    }).
    when('/client', {
      templateUrl: 'partials/client-news-feed.html',
      controller: 'NewsCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
  }]);
