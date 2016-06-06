'use strict';
angular.module('homeApp.educate')
	.controller('stuAttendList', function($scope, $routeParams, fetchStuAttTable) {
		fetchStuAttTable($routeParams, function(result) {
			console.log(result);
			$scope.courseAttend = result;
			$scope.$apply();
		})
	})
	
	//教师修改学生的出勤状态
	.controller('teaStuAttend', function($scope, $routeParams, allAttend, fetchStuAttend, modifyStuAttend) {
		console.log($routeParams);
		$scope.attendType = [{
			"id": '0',
			"name": '缺勤'
		},{
			"id": '1',
			"name": '已到'
		}]

		
		fetchStuAttend($routeParams, function(result) {
			console.log(result);
			$scope.courseStuInfo = result;
			$scope.$apply();
		})

		$scope.modify = function(index) {
			var item = $scope.courseStuInfo.stuInfo[index];
			if(item.isEditing) {
				var postData = {
					"course_id": $routeParams.course_id,
					"stu_id": item.stu_id,
					"stu_state": item.stu_state
				}
				modifyStuAttend(postData, function(result) {
					if(result.status) {
						alert('修改成功');

					}
				})
				
			}
			$scope.courseStuInfo.stuInfo[index].isEditing = !item.isEditing;
		}

		$scope.allAttend = function() {
			allAttend($routeParams, function(result) {
				if(result.status) {
					alert('操作成功');
					window.location.reload();
				}
			})
		}
	})
	
	.controller('homework', function($scope, $routeParams, fetchHomeworks,modHomework) {
		fetchHomeworks($routeParams, function(result) {
			console.log(result)
			$scope.courseStuInfo = result;
			$scope.$apply();
		})

		$scope.modify = function(index) {
			var item = $scope.courseStuInfo.stuInfo[index],
				status = item.isEditing;
			if(status) {
				var postData = {
					"stu_id": item.stu_id,
					//"course_id": '1', //排课编号,
					"att_id": item.course_id,
					"comment": item.homework_state
				}
				console.log(postData);
				modHomework(postData, function(result) {
					if(result.status == 1) {
						alert('修改成功');
					}
				}) 
			}
			$scope.courseStuInfo.stuInfo[index].isEditing = !status;	
		}
	})