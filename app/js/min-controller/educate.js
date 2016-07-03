'use strict';
angular.module('homeApp.educate', ['ngRoute', 'homeApp.educateService'])
	.config(function($routeProvider) {
		$routeProvider
			.when('/eduCourseList', {
				templateUrl: 'views/educate/eduCourseList.html',
				controller: 'eduCourseList'
			})
			.when('/eduStuList/:course_id', {
				templateUrl: 'views/educate/eduStuList.html',
				controller: 'eduStuList'
			})
			.when('/todayClass/:course_id', {
				templateUrl: 'views/educate/todayClass.html',
				controller: 'todayClass'
			})
			.when('/stuAttendList/:course_id', {
				templateUrl: 'views/educate/stuAttendList.html',
				controller: 'stuAttendList'
			})
			.when('/teaStuAttend/:course_id', {
				templateUrl: 'views/educate/teaStuAttend.html',
				controller: 'teaStuAttend'
			})
			.when('/teaStuInfo/:stu_id', {
				templateUrl: 'views/educate/teaStuInfo.html',
				controller: 'teaStuInfo'
			})
			.when('/homework/:course_id', {
				templateUrl: 'views/educate/homework.html',
				controller: 'homework'
			})
			.when('/teaCallback/:course_id/:stu_id', {
				templateUrl: 'views/educate/callback.html',
				controller: 'teaCallback'
			})
			.when('/teaReport/:course_id/:stu_id', {
				templateUrl: 'views/educate/teaReport.html',
				controller: 'teaReport'
			})
	})
'use strict';
angular.module('homeApp.educateService', [])
	.factory('eduAPI', function(server) {
		return {
			"fecthAllCourse": server + 'get_course',
			"fetchCourseStu": server + 'get_student',
			"fetchStuInfoById": server + 'get_student_information',
			"fetchTodayClass": server + 'get_course_information',
			"fetchHomeworks": server + 'get_student_homework_state',
			"fetchStuAttend": server + 'get_student_attendance',
			"modifyStuAttend": server + 'change_student_attendance',
			"allAttend": server + 'change_student_attendance',
			"fetchTeaCallBack": server + 'get_callback2',
			"postCallback": server + 'add_callback',
			"modifyCallback": server + 'change_callback2',
			"postClassRecord": server + 'change_course_record',
			"modHomework": server + 'change_student_homework_state'
		}
	})
	.factory('modHomework', function(eduAPI) {
		return function(data, callBack) {
			postData(eduAPI.modHomework, data, callBack);
		}
	})
	.factory('postClassRecord', function(eduAPI) {
		return function(data, callBack) {
			postData(eduAPI.postClassRecord, data, callBack);
		}
	})
	.factory('fetchTeaCallBack', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fetchTeaCallBack, callBack, data);
		}
	})

	.factory('postCallback', function(eduAPI) {
		return function(data, callBack) {
			postData(eduAPI.postCallback, data, callBack);
		}
	})

	.factory('modifyCallback', function(eduAPI) {
		return function(data, callBack) {
			postData(eduAPI.modifyCallback, data, callBack);
		}
	})
	.factory('fecthAllCourse', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fecthAllCourse, callBack, data);
		}
	})
	.factory('fetchCourseStu', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fetchCourseStu, callBack, data);
		}
	})
	.factory('fetchTodayClass', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fetchTodayClass, callBack, data);
		}

	})

	.factory('fetchStuInfoById', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fetchStuInfoById, callBack, data);
		}
	})

	.factory('fetchHomeworks', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fetchHomeworks, callBack, data);
		}
	})

	.factory('fetchStuAttend', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fetchStuAttend, callBack, data);
		}
	})
	.factory('modifyStuAttend', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.modifyStuAttend, callBack, data);
		}
		
	})
	.factory('allAttend', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.allAttend, callBack, data);
		}
	})
	
'use strict';
angular.module('homeApp.educate')
	.controller('eduCourseList', function($scope, fecthAllCourse) {
		fecthAllCourse('', function(result) {
			$scope.$apply(function() {
				$scope.courseList = result;
			})
		})
	})
	.controller('eduStuList', function($scope, $routeParams, fetchCourseStu) {
		fetchCourseStu($routeParams, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})
	})
	.controller('todayClass', function($scope, $routeParams, fetchTodayClass, postClassRecord) {
		//$scope.data = fetchTodayClass($routeParams);

		fetchTodayClass($routeParams, function(result) {
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
		})

		$scope.postData = {
			"course_id": $routeParams.course_id,
			"stu_id": $routeParams.stu_id,
			"new_callback": ''
		}
		$scope.submitCallback = function() {
			postCallback($scope.postData, function(result) {
				callbackAlert(result.status, 'submit successfully');
			})
		}

		$scope.modify = function(index) {
			var data = $scope.callback.callbacks[index];
			data.course_id = $routeParams.course_id;
			data.stu_id = $routeParams.stu_id
			modifyCallback(data, function(result) {
				callbackAlert(result.status, 'modify successfully');
			})
		}
	})

	.controller('teaReport', function($scope, $routeParams, getReport, postReport, createChart, submitReport) {
		//hide the whole header, for the printing reasons
		$('#header').hide();
		
		getReport($routeParams, function(result) {
			$scope.data = result;
			createChart(result.chart_data.items, result.chart_data.score);
			$scope.$apply();
		})

		
		
		$scope.submitReport = function() {
			console.log($scope.data);
			$scope.data.stu_id = $routeParams.stu_id;
			$scope.data.course_id = $routeParams.course_id;
			submitReport($scope.data, function(result) {
				callbackAlert(result.status);
			})
		}
	})
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