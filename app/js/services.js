'use strict';

/* Services */

var newsServices = angular.module('newsServices', ['ngResource']);

newsServices.factory('User', ['$resource', '$log', '$http', '$q',
  function($resource, $log, $http, $q){

    return $resource('/project/RESTapi/public/user/:action', {}, {
      login: {method:'POST', isArray: false}
    });

  }
]);
