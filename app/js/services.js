'use strict';

/* Services */

var newsServices = angular.module('newsServices', ['ngResource']);

newsServices.factory('User', ['$resource',
  function($resource){
    return $resource('/project/RESTapi/public/user', {}, {
      login: {method:'GET', params:{id: 2}, isArray:true}
    });
  }]);
