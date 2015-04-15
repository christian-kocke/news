'use strict';

/* Directives */

var newsDirectives = angular.module('newsDirectives', []);

newsDirectives.directive('loginDialog', function (AUTH_EVENTS) {
	return {
		restrict: 'A',
		template: '<div ng-if="visible" ng-include="\'login.html\'">',
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

newsDirectives.directive('passwordMatch', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, elm, attrs, ctrl) {
      		ctrl.$validators.passwordmatch = function (modelValue, viewValue) {
      			var password = scope.changePasswordForm.password.$modelValue;
      			if(password) {
      				if(password === modelValue) {
      					return true;
      				}
      			}
      			return false;
			}
		}
	};
});


newsDirectives.directive('passwordCheck', function ($q, AuthService) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, elm, attrs, ctrl) {
			ctrl.$asyncValidators.passwordcheck = function (modelValue, viewValue) {

				var def = $q.defer();

				if(modelValue) {
					AuthService.checkPassword({password : modelValue}).then(function (res) {
						if(res) {
							def.resolve();
						}else{
							def.reject();
						}
					});
				}else{
					def.reject();
				}

				return def.promise;
			}
		}
	};
});

var app = angular.module('form-example1', []);

var INTEGER_REGEXP = /^\-?\d+$/;
newsDirectives.directive('integer', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.integer = function(modelValue, viewValue) {

        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
});

app.directive('username', function($q, $timeout) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
    var usernames = ['Jim', 'John', 'Jill', 'Jackie'];

      ctrl.$asyncValidators.username = function(modelValue, viewValue) {

        if (ctrl.$isEmpty(modelValue)) {
          // consider empty model valid
          return $q.when();
        }

        var def = $q.defer();

        $timeout(function() {
          // Mock a delayed response
          if (usernames.indexOf(modelValue) === -1) {
            // The username is available
            def.resolve();
          } else {
            def.reject();
          }

        }, 2000);

        return def.promise;
      };
    }
  };
});

