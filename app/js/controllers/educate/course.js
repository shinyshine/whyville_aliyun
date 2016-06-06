'use strict';
angular.module('homeApp.educate')
	.controller('eduCourseList', function($scope, fecthAllCourse) {
		//$scope.courseList = fecthAllCourse();
		fecthAllCourse('', function(result) {
			console.log(result)
			$scope.$apply(function() {
				$scope.courseList = result;
			})
		})
	})
	.controller('eduStuList', function($scope, $routeParams, fetchCourseStu) {
		fetchCourseStu($routeParams, function(result) {
			console.log(result)
			$scope.$apply(function() {
				$scope.data = result;
			})
		})
		// $scope.data = fetchCourseStu($routeParams);
		// console.log($scope.data);
	})
	.controller('todayClass', function($scope, $routeParams, fetchTodayClass, postClassRecord) {
		//$scope.data = fetchTodayClass($routeParams);

		fetchTodayClass($routeParams, function(result) {
			console.log(result);
			$scope.$apply(function() {
				$scope.data = result;
			})
		})
		$scope.modify = function(index) {
			var cur = $scope.data.classes[index],
				status = cur.isEditing;

			if(status) {
				var postData = {
					"course_id": cur.id, //排课编号,
					"att_id": cur.id,
					"note": cur.note
				}
				postClassRecord(postData, function(result) {
					if(result.status == 1) {
						alert('提交成功')
					}
				})
				console.log($scope.data.classes[index].note);
			}
			$scope.data.classes[index].isEditing = !status;
		}
	})

	.controller('teaCallback', function($scope, $routeParams, fetchTeaCallBack, postCallback, modifyCallback) {
		fetchTeaCallBack($routeParams, function(result) {
			$scope.callback = result;
			$scope.$apply();
			console.log(result);
		})

		$scope.postData = {
			"course_id": $routeParams.course_id,
			"stu_id": $routeParams.stu_id,
			"new_callback": ''
		}
		$scope.submitCallback = function() {
			postCallback($scope.postData, function(result) {
				if(result.status) {
					alert('submit successfully');
				}
			})
		}

		$scope.modify = function(index) {
			var data = $scope.callback.callbacks[index];
			data.course_id = $routeParams.course_id;
			data.stu_id = $routeParams.stu_id
			modifyCallback(data, function(result) {
				if(result.status) {
					alert('modify successfully');
				}
			})
		}
	})

	.controller('teaReport', function($scope, $routeParams, getReport, postReport, createChart, submitReport) {
		//hide the whole header, for the printing reasons
		$('#header').hide();
		
		getReport($routeParams, function(result) {
			console.log(result);
			$scope.data = result;
			createChart(result.chart_data.items, result.chart_data.score);
			$scope.$apply();
		})

		
		
		$scope.submitReport = function() {
			console.log($scope.data);
			$scope.data.stu_id = $routeParams.stu_id;
			$scope.data.course_id = $routeParams.course_id;
			submitReport($scope.data, function(result) {
				if(result.status) {
					alert('操作成功');
				}else{
					alert('请完善信息');
				}
			})
		}
		
		// $scope.submitReport = function() {
		// 	console.log($scope.data);
		// 	$scope.data.stu_id = $routeParams.stu_id;
		// 	$scope.data.course_id = $routeParams.course_id;
		// 	submitReport($scope.data, function(result) {
		// 		console.log(result);
		// 	})
		// }
	})