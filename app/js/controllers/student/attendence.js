'use strict';
angular.module('homeApp.student')
	.controller('teachAttend', function($scope, $routeParams, fetchPlanCouOp, fetchCourseRecord, modifyClassInfo) {
		//console.log($routeParams);  排课id
		// fetchOptions('', function(result1) {
			
		// 	fetchPlanCouOp('', function(result2) {
		// 		// $scope.options.teachers = result2.teachers;
		// 		// $scope.$apply();
		// 		$scope.options = {
		// 			"schools": result1.schools,
		// 			"teachers": result2.teachers
		// 		}
		// 	})
		// 	$scope.$apply();
		// })

		var options = localStorage.getItem('options'),
			courses = localStorage.getItem('course');

		options = JSON.parse(options);
		courses = JSON.parse(courses);

		$scope.options = {
			schools: options.schools,
			teachers: courses.teachers
		}

		$scope.attendType = [{
			"id": 0,
			"name": '缺勤'
		},{
			"id": 1,
			"name": '已到'
		}]

		fetchCourseRecord($routeParams, function(result) {
			console.log(result)
			$scope.courseInfo = result;
			$scope.$apply();
		})
		
		/*修改上课时间，老师，老师的出勤状态*/
		$scope.modify = function(index) {
			var status = $scope.courseInfo.courseList[index].isEditing;
			if(status) {
				var course = $scope.courseInfo.courseList[index];
				var date_time = course.course_date_time,
					dateArr = date_time.split(' '),
					date = dateArr[0],
					time = dateArr[1],
					timeArr = time.split('~'),
					time1 = timeArr[0],
					time2 = timeArr[1];
				if(isDate(date) && isTime(time1) && isTime(time2)) {
					var data = {
						"course_id": course.course_id,
						"course_date_time": course.course_date_time,
						"tea_id": course.course_teacher,
						"teacher_state": course.teacher_state
					}

					modifyClassInfo(data, function(result) {
						if(result.status == 1) {
							alert('修改成功');
						}
					})
				}else {
					alert('请按照正确的日期和时间格式');
				}
				
			}
			$scope.courseInfo.courseList[index].isEditing = !status;
		}
	})
	.controller('stuAttend', function($scope, $routeParams, fetchStuAttList, modifyStuAttend, allParticipated) {
		$scope.attendType = [{
			"id": 0,
			"name": '缺勤'
		},{
			"id": 1,
			"name": '已到'
		}]
		fetchStuAttList($routeParams, function(result) {
			$scope.$apply(function() {
				$scope.courseStuInfo = result;
			})
		})

		$scope.modify = function(index) {
			var item = $scope.courseStuInfo.stuInfo[index];
			if(item.isEditing) {
				//$http 
				//console.log('发送请求给后台，修改出勤状况');
				var postData = {
					"course_id": $routeParams.course_id,
					"stu_id": item.stu_id,
					"stu_state": item.stu_state
				}
				console.log(postData);
				modifyStuAttend(postData, function(result) {
					if(result.status == 1) {
						alert('修改成功');
					}else {
						alert('操作失败。请稍后重试');
					}
				})

			}
			$scope.courseStuInfo.stuInfo[index].isEditing = !item.isEditing;
		}

		$scope.allParticipated = function() {
			allParticipated($routeParams, function(result) {
				if(result.status == 1) {
					window.location.reload();
				}
			})
		}
	})
	.controller('attendList', function($scope, $routeParams, fetchStuAttTable) {
		fetchStuAttTable($routeParams, function(result) {
			console.log(result)
			$scope.courseAttend = result;
			$scope.$apply();
		})
	})