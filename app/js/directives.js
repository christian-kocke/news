'use strict';

/* Directives */


var newsDirectives = angular.module('newsDirectives', []);

newsDirectives.directive('loginDialog', function (AUTH_EVENTS) {
	return {
		restrict: 'A',
		template: '<div ng-if="visible"
		ng-include="\'login.html\'">',
		link: function (scope) {
			var showDialog = function () {
				scope.visible = true;
			};

			scope.visible = false;
			scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
			scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);
		}
	};
});

newsDirectives.directive('passwordValidation', function ($log) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, elem, attr, ngModel) {
			$console.log("ok")
			log.log("ok");
			ngModel.$parsers.unshift(function(value) {
				console.log(value);
				ctrl.$setValidity("passwordConfirmation", true);
			});

			ngModel.$formatters.unshift(function(value) {
				console.log(value);
			});
		};
	};
});