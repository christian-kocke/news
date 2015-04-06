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
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'AuthCtrl'
      }).
      when('/', {
        templateUrl: 'partials/registration.html'
      }).
      when('/client', {
        templateUrl: 'partials/client-news-feed.html',
        controller: 'NewsCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
