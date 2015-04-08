'use strict';

/* Controllers */

var newsControllers = angular.module('newsControllers', ['angularFileUpload']);

/*newsControllers.directive("drop", ['$rootScope', function($rootScope) {

	function dragEnter(evt, element) {
		evt.preventDefault();
	};
	function dragLeave(evt, element) {
		evt.preventDefault();
		element.removeClass('dropfileHover');
	};
	function dragOver(evt) {
		evt.preventDefault();
		$(this).addClass('dropfileHover');
	};

	return {
		restrict: 'A',
		link: function(scope, element)  {
			element.bind('dragenter', function(evt) {
				dragEnter(evt, element);
			});
			element.bind('dragleave', function(evt) {
				dragLeave(evt, element);
			});
			element.bind('dragover', dragOver);
			element.bind('drop', function(evt) {
				evt.preventDefault();
				var files = evt.dataTransfer.files;
				console.log(files);
				$rootScope.$broadcast('dropEvent', files);
			});
		}
	}
}]);
*/

newsControllers.controller('ProfilCtrl', ["$scope", "$upload", '$http', function($scope,$upload,$http) {
	/*$rootScope.$on('dropEvent', function(evt, data) {
		$http.post('js/upload.php',data).success(function(response) {
			console.log('done');
		});
});*/
$scope.$watch('files', function () {
	$scope.upload($scope.files);
});
$scope.upload = function (files) {
	if (files && files.length) {
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			console.log(file);
			$upload.upload({
				url: 'js/upload.php',
				headers: {
					nom: file.name
				},
				file: file
			}).progress(function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				console.log('progress: ' + progressPercentage + '% ' +
					evt.config.file.name);
			}).success(function (data, status, headers, config) {
				console.log('file ' + config.file.name + 'uploaded. Response: ' +
					JSON.stringify(data));
			});
		}
	}
};
}]);

newsControllers.controller('ApplicationController', function ($scope, USER_ROLES, AuthService, $location, $log, Session) {

	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;

	$scope.setCurrentUser = function (user) {
		$scope.currentUser = user;
	};

})



newsControllers.controller('NewsCtrl', ['$scope', '$http', '$log', function($scope,$http,$log) {
	
	$scope.showArticle = false;
	$http.post('/project/app/js/posts.json').success(function(response) {
		$scope.articles = response;
	});
	$scope.doClick = function(id) {
		$scope.currentArticle = $scope.articles[id-1];
		$scope.showArticle = !$scope.showArticle;
	};
}]);

newsControllers.controller('AuthCtrl', function($scope, $rootScope, AUTH_EVENTS, AuthService) {

	$scope.credentials = {
		email: '',
		password: ''
	};

	$scope.login = function (credentials) {
		AuthService.login(credentials).then(function (user) {
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			$scope.setCurrentUser(user);
		}, function () {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});
	};

	$scope.logout = function () {
		AuthService.logout().then(function (res) {
			$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
			$scope.setCurrentUser(null);
		});
	};
});


