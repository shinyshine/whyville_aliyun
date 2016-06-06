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
	