'use strict';
angular.module('homeApp.educate')
	.controller('teaStuInfo', function($scope, $routeParams, fetchStuInfoById) {
		$scope.sidebar = [{
			"name": '基本信息',
			"link": '#basic',
			"default": 1
		},{
			"name": '家长信息',
			"link": '#parent'
		}]
		fetchStuInfoById($routeParams, function(result) {
			console.log(result);
			$scope.$apply(function() {
				$scope.stuInfo = result;
			})
		})
	})