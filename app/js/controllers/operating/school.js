'use strict'
angular.module('homeApp.operating')
	.controller('SchoolManage', function($scope, $cookies, fetchOptions, $location, fetchAllSchools) {
		$scope.emp_type = {
			authority: $cookies.get('authority')
		}
		fetchAllSchools('', function(result) {
			$scope.$apply(function() {
				$scope.result = result;
			})
		})

		$scope.addSchool = function() {
			if($scope.user.authority != 0) {
				alert('没有权限');
				return false;
			}else {
				//update data in localstorage
                fetchOptions('', function(result1) {
                  localStorage.setItem('options', JSON.stringify(result1));
                })
				$location.path('/addSchool');
			}
		}
		$scope.modifySchool = function(sch_id) {
			if($scope.user.authority != 0) {
				alert('没有权限');
				return false;
			}else {
				$location.path('/modifySchool/' + sch_id);
			}
		}
	})
	.controller('AddSchool', function($scope, addSchool) {
		$scope.formData = {
			"sch_name": '',
			"sch_ads": '',
			"sch_phone": ''
		}
		$scope.submitData = function() {
			addSchool($scope.formData, function(result) {
				window.location.href = ROOT + 'schoolManage';
			})
		}
	})
	.controller('modifySchool', function($scope, $routeParams, fetchSchById, modifySchInfo) {
		//$routeParams = {"sch_id": "1"};
		fetchSchById($routeParams, function(result) {
			console.log(result);
			$scope.schInfo = result.schInfo;
			$scope.$apply();
		});

		$scope.submitForm = function() {
			console.log($scope.schInfo);
			$scope.schInfo.sch_id = $routeParams.sch_id;
			modifySchInfo($scope.schInfo, function(result) {
				if (result.status) {
					window.location.href = ROOT + 'schoolManage';
				}
			})
		}
	})