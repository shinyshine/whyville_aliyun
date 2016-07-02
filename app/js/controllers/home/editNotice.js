'use strict';
angular.module('homeApp.home')
	//查看公告详情
	.controller('notice',function($scope, $routeParams, fetchNoticeById) {
		fetchNoticeById($routeParams, function(result) {
			console.log(result)
			$scope.notice = result;
			$scope.$apply();
		})
	})
	.controller('addNotice', function($scope, $location, $cookies, addNoticeFormInit, submitNotice) {
		//init the form of add notice
		$scope.formData = addNoticeFormInit;

		//处理添加公告的权限问题
		var emp_type = {
			authority: $cookies.get('authority'),
			type: $cookies.get('type')
		}

		if(emp_type.type != 0 && emp_type.type != 1 && emp_type.type != 2) {
			alert('没有权限访问');
			$location.path('/' + $cookies.get('user_id'));
		}else if(emp_type.authority != 0 && emp_type.type != 1) {
			//只能添加自个儿校区的公告和日程
			$scope.formData.ntc_sch = {
				id: $cookies.get('sch_id'),
				name: $cookies.get('sch_name')
			}
		}else {
			//是CEO或者是财务
			//init select options
			var options = localStorage.getItem('options');
			options = JSON.parse(options);

			$scope.options = {
				schools: options.schools
			}
		}
		
		

		$scope.submitData = function(valid) {
			if(valid) {
				submitNotice($scope.formData, function(result) {
					if (result.status) {
						alert('添加成功');
						// $scope.$apply(function() { 
						// 	$location.path("/" + $cookies.get('user_id')); 
						// });	
					window.location.href = ROOT + $cookies.get('user_id');
					};
				})
			}else{
				alert('fail valid')
			}
		}
	})
	.controller('modifyNotice', function($scope, $location, $cookies, $routeParams, fetchOptions, fetchNoticeById, modifyNotice) {
		//处理添加公告的权限问题
		var emp_type = {
			authority: $cookies.get('authority'),
			type: $cookies.get('type')
		}

		if(emp_type.type != 0 && emp_type.type != 1 && emp_type.type != 2) {
			alert('没有权限访问');
			$location.path('/' + $cookies.get('user_id'));
		}else if(emp_type.authority != 0 && emp_type.type != 1) {
			//只能添加自个儿校区的公告和日程
			// $scope.formData.ntc_sch = {
			// 	id: $cookies.get('sch_id'),
			// 	name: $cookies.get('sch_name')
			// }
		}else {
			//是CEO或者是财务
			fetchOptions('', function(result) {
				$scope.options = {
					schools: result.schools
				}
				$scope.$apply();
			})
		}
		
		fetchNoticeById($routeParams, function(result) {
			console.log(result);
			$scope.formData = result;
			$scope.$apply();
		});
		$scope.submitData = function() {
			$scope.formData.ntc_id = $routeParams.ntc_id;
			modifyNotice($scope.formData, function(result) {
				if(result.status) {
					alert('修改成功');
					window.location.href = ROOT + $cookies.get('user_id');
				}
			})
		}
	})
	.controller('addSchedule', function($scope, $location, $cookies, addScheFormInit, fetchOptions, submitSche) {
		// init the form og add schedule
		$scope.formData = addScheFormInit;

		//limit the right to modify the schedule
		var emp_type = {
			authority: $cookies.get('authority'),
			type: $cookies.get('type')
		}

		if(emp_type.type != 0 && emp_type.type != 1 && emp_type.type != 2) {
			alert('没有权限访问');
			$location.path('/' + $cookies.get('user_id'));
		}else if(emp_type.authority != 0 && emp_type.type != 1) {
			//只能添加自个儿校区的公告和日程
			$scope.formData.ntc_sch = {
				id: $cookies.get('sch_id'),
				name: $cookies.get('sch_name')
			}
		}else {
			//是CEO或者是财务
			fetchOptions('', function(result) {
				$scope.options = {
					schools: result.schools
				}
				$scope.$apply();
			})
		}

		

		$scope.submitData = function() {
			console.log($scope.formData);
			if(checkInputInObj($scope.formData)) {
				console.log($scope.formData);
				//在这里启动提交数据的服务
				submitSche($scope.formData, function(result) {
					if (result.status) {
						alert('添加成功');
						window.location.href = ROOT + $cookies.get('user_id');
					};
				})
			}
		}
	})
	.controller('modifySchedule', function($scope, $location, $cookies, $routeParams, fetchOptions, fetchScheById, modifySche) {
		//limit the right to modify the schedule
		var emp_type = {
			authority: $cookies.get('authority'),
			type: $cookies.get('type')
		}

		if(emp_type.type != 0 && emp_type.type != 1 && emp_type.type != 2) {
			alert('没有权限访问');
			$location.path('/' + $cookies.get('user_id'));
			
		}else if(emp_type.authority != 0 && emp_type.type != 1) {
			//只能添加自个儿校区的公告和日程
			// $scope.formData.ntc_sch = {
			// 	id: $cookies.get('sch_id'),
			// 	name: $cookies.get('sch_name')
			// }
		}else {
			//是CEO或者是财务
			fetchOptions('', function(result) {
				$scope.options = {
					schools: result.schools
				}
				$scope.$apply();
			})
		}

		fetchScheById($routeParams, function(result) {
			$scope.formData = result;
			$scope.$apply();
		});

		$scope.submitData = function() {
			$scope.formData.ntc_id = $routeParams.ntc_id;
			modifySche($scope.formData, function(result) {
				if(result.status) {
					alert('修改成功');
					window.location.href = ROOT + $cookies.get('user_id');
				}
			})
		}
	})

