'use strict';

angular.module('homeApp.operating')
	.controller('employees', function($scope, $cookies, $location, employees, deleteEmp, resetPwd, createId, fetchOptions, pagination) {
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"page": 1,
			"num": num_per_page,
			"authority": $cookies.get('authority')
		}
		fetchOptions('', function(result) {
			$scope.$apply(function() {
				$scope.options = {
					"schools": result.schools
				}
			})
		})

		//about pagination
		$scope.paginationConf = {};
		
		//employees是服务返回数据
		employees($scope.filter, function(result) {
			console.log(result);
			$scope.result = result.employees;

			//about pagination
			var total = result.sum;
			$scope.paginationConf = pagination(total);
			$scope.paginationConf.onChange = function() {
				$scope.filter.page = $scope.paginationConf.currentPage;
				$scope.pageChange();
			}
			$scope.$apply();
		});
		$scope.pageChange = function() {
			employees($scope.filter, function(result) {
				$scope.result = result.employees;
				$scope.$apply();
			});
		}

		//选择左上角校区筛选员工
		$scope.sendFilter = function() {
			$scope.filter.page = 1;
			employees($scope.filter, function(result) {
				console.log(result);
				$scope.result = result.employees;
				$scope.paginationConf.totalItems = result.sum;
				$scope.$apply();
			});

		}

		//删除员工  其实是离职
		$scope.deleteEmp = function(emp_id) {
			if (confirm('确认离职？')) {
				var emp = {
					emp_id: emp_id
				}
				deleteEmp(emp, function(result) {
					if(result.status) {
						//alert('成功离职');
						window.location.reload();
					}
				})
				// var deleteStatus = deleteEmp.deleteEmp(emp);
				// if (deleteStatus.status) {
				// 	window.location.reload();
				// }
			}
		}

		//重置密码
		$scope.resetPwd = function(emp_id) {
			if(confirm('确认重置密码？')) {
				var emp = {
					emp_id: emp_id
				}
				resetPwd(emp, function(result) {
					if(result.status) {
						alert('已重置密码');
						window.location.reload();
					}
				})
			}
			
		}

		$scope.addEmp = function() {
			createId('', function(result) {
				if(result.status) {
					console.log(result.emp_id);
					$scope.$apply(function() {
						$location.path('/addEmp/' + result.emp_id);
					})
					
				}
			})
		}
	})