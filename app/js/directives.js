'use strict';

/* Directives */


var newsDirectives = angular.module('newsDirectives', []);

<<<<<<< HEAD
newsDirectives.directive('loginDialog', function (AUTH_EVENTS) {
	
=======
.directive('loginDialog', function (AUTH_EVENTS) {

>>>>>>> origin/master
	return {
		restrict: 'A',
		template: '<div ng-if="visible"
		ng-include="\'login-form.html\'">',
		link: function (scope) {
			var showDialog = function () {
				scope.visible = true;
			};

			scope.visible = false;
			scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
			scope.$on(AUTH_EVENTS.sessionTimeout, showDialog)
		}
	};
});