'use strict';
angular.module('homeApp.student')
	.controller('courseList', function($scope, deleteCourse, getYearSessions, fetchCourseList) {
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"selectSession": {
				"id": 0,
				"name": '全部季度'
			},
			"selectYear": {
				"name": '2016'
			},
			"courseType": {
				"id": 1,
				"name": '所有课程类型'
			},
			"search": '',
		}
		// fetchOptions('', function(result) {
		// 	//console.log(result)
		// 	$scope.options = {
		// 		"schools": result.schools,
		// 		"years": getYearSessions.year,
		// 		"sessions": getYearSessions.sessions,
		// 		"courseType": result.courseType
		// 	}
		// 	$scope.$apply();
		// })

		var options = localStorage.getItem('options');
		options = JSON.parse(options);

		$scope.options = {
			schools: options.schools,
			years: getYearSessions.year,
			sessions: getYearSessions.sessions,
			courseType: options.courseType
		}
	
		//初始化课程列
		fetchCourseList($scope.filter, function(result) {
			console.log(result);
			$scope.courses = result;
			$scope.$apply();
		});

		$scope.sendFilter = function() {
			fetchCourseList($scope.filter, function(result) {
				console.log(result);
				$scope.courses = result;
				$scope.$apply();
			});
		}

		//delete course
		$scope.deleteCourse = function(course_id) {
			var data = {
				course_id: course_id
			}
			deleteCourse(data, function(result) {
				callbackAlert(result.status, '成功删除一门课程');
				window.location.reload();
			})
		}
	})
	.controller('courseStuList', function($scope, $routeParams, deleteStuInCourse, fetchStuInfoOfTheCourse) {
		fetchStuInfoOfTheCourse($routeParams, function(result) {
			console.log(result);
			$scope.stuCourse = result;
			$scope.$apply();
		})

		$scope.deleteStu = function(stu_id) {
			var data = {
				course_id: $routeParams.course_id,
				stu_id: stu_id
			}
			deleteStuInCourse(data, function(result) {
				callbackAlert(result.status, '成功删除一门课程');
				// if(result.status == 1) {
				// 	alert('成功删除一位学生');
				// }else{
				// 	alert('该学生不可被删除');
				// }
			})
		}
	})
	.controller('addCourse', function($scope, fetchOptions, postCourse) {
		// fetchOptions('', function(result) {
		// 	console.log(result);
		// 	$scope.options = {
		// 		schools: result.schools,
		// 		courseType: result.courseType
		// 	}
		// 	$scope.$apply();
		// })
		var options = localStorage.getItem('options');
		options = JSON.parse(options);

		$scope.options = {
			schools: options.schools,
			courseType: options.courseType
		}
		//初始化表单
		$scope.course = {
			"school": {
				"id": '',
				"name": ''
			},
			"courseType": {
				"id": '',
				"name": ''
			},
			"courseName": ''
		}

		$scope.addCourse = function() {
			if($scope.course.school.id && $scope.course.courseType.id &&$scope.course.courseName) {
				postCourse($scope.course, function(result) {
					callbackAlert(result.status, '添加成功');
					if(result.status == 1) {
						window.location.href = ROOT + 'courseList';
					}
				})
			}
			
			
		}
	})
	.controller('planCourse', function($scope, fetchPlanCouOp, initPlanForm, getYearSessions, getWeekDays, planCourse) {
		var courses = localStorage.getItem('courses');
		courses = JSON.parse(courses);
		$scope.options = {
			teachers: courses.teachers,
			courses: courses.courses,
			year: getYearSessions.year,
			sessions: getYearSessions.session,
			weekdays: getWeekDays
		}

		$scope.course = initPlanForm;

		$scope.submitCourseInfo = function() {
			var cou = $scope.course;
			if(cou.course_year && cou.course_session && cou.course_name.id && cou.course_teacher.id) {
				
				//filter time format
				var week = cou.weekdays;

				for(var item in week) {
					var cur = week[item];
					if(cur.choose) {
						//console.log(week[item]);
						if(!isTime(cur.start_time) || !isTime(cur.end_time)) {
							alert('请使用正确的时间格式, 12:00');
							return false;
						}
					}
				}
				planCourse($scope.course, function(result) {
					callbackAlert(result.status, '成功排课');
					if(result.status == 1) {
						window.location.href = ROOT + 'courseList';
					}
				})
			}else {
				alert('请完成必要信息的额填写');
			}
		}
	})
	.controller('addStuToCourse', function($scope, $routeParams, initAddToCourseForm, fetchCourseInfo, addStuToCourse, getStuName) {
		fetchCourseInfo($routeParams, function(result) {
			console.log(result);
			$scope.courseInfo = result;
			$scope.$apply();
		})

		
		$scope.formData = initAddToCourseForm($routeParams.course_id);

		$scope.options = {
			"discount": [{
				"id": 0,
				"name": '打折'
			},{
				"id": 1,
				"name": '减价'
			}]
		}
		// fetchOptions('', function(result) {
		// 	$scope.options.pay_method = result.pay_method;
		// 	$scope.$apply();
		// })

		var options = localStorage.getItem('options');
		options = JSON.parse(options);
		$scope.options.pay_method = options.pay_method;


		//get student's name by his id
		$scope.getStuName = function() {
			var stuId = {
				stu_id: $scope.formData.stu_id
			}

			//$scope.formData.stu_name = getStuName().stu_name;
			getStuName(stuId, function(result) {
				console.log(result);
				$scope.formData.stu_name = result.stu_name;
				$scope.$apply();
			})
		}
		

		$scope.submitData = function() {
			addStuToCourse($scope.formData, function(result) {
				callbackAlert(result.status, '添加成功');
				if(result.status == 1) {
					window.location.href = ROOT + 'courseStuList/' + $routeParams.course_id;
				}
			})
		}
	})
	.controller('callback', function($scope, $routeParams, fetchCallBack, modifyCallback) {
		fetchCallBack($routeParams, function(result) {
			$scope.callback = result;
			$scope.$apply();
		})
		
		$scope.submitCallback = function(index) {
			var postData = $scope.callback.callbacks[index];
			postData.course_id = $routeParams.course_id;
			postData.stu_id = $routeParams.stu_id;
			console.log(postData);
			modifyCallback(postData, function(result) {
				callbackAlert(result.status);
			})
		}
	})
	.controller('report', function($scope, $routeParams, getReport, postReport, createChart, submitReport) {
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
				if(result.status == 1) {
					alert('操作成功');
				}else{
					alert('请完善信息');
				}
			})
		}
	})