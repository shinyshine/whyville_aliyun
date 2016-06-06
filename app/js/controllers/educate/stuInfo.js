'use strict';
angular.module('homeApp.educate')
	.controller('teaStuInfo', function($scope, $routeParams, fetchStuInfoById) {
		fetchStuInfoById($routeParams, function(result) {
			console.log(result);
			$scope.$apply(function() {
				$scope.stuInfo = result;
			})
		})
	})