'use strict';
angular.module('homeApp.student', ['ngRoute', 'homeApp.studentService'])
	.config(function($routeProvider) {
		$routeProvider
			.when('/stuList', {
				templateUrl: 'views/student/stuList.html',
				controller: 'stuList'
			})
			.when('/stuInfo/:stu_id', {
				templateUrl: 'views/student/stuInfo.html',
				controller: 'stuInfo'
			})
			.when('/addStu/:stu_id', {
				templateUrl: 'views/student/addStuInfo.html',
				controller: 'addStu'
			})
			.when('/modifyStuInfo/:stu_id', {
				templateUrl: 'views/student/modifyStu.html',
				controller: 'modifyStuInfo'
			})
			.when('/courseList', {
				templateUrl: 'views/student/courseList.html',
				controller: 'courseList'
			})
			.when('/courseStuList/:course_id', {
				templateUrl: 'views/student/courseStuList.html',
				controller: 'courseStuList'
			})
			.when('/teachAttend/:course_id', {
				templateUrl: 'views/student/teachAttend.html',
				controller: 'teachAttend'
			})
			.when('/stuAttend/:course_id', {
				templateUrl: 'views/student/stuAttend.html',
				controller: 'stuAttend'
			})
			.when('/addCourse', {
				templateUrl: 'views/student/addCourse.html',
				controller: 'addCourse'
			})
			.when('/planCourse', {
				templateUrl: 'views/student/planCourse.html',
				controller: 'planCourse'
			})
			.when('/addStuToCourse/:course_id', {
				templateUrl: 'views/student/stuCourse.html',
				controller: 'addStuToCourse'
			})
			.when('/modStuCourse/:course_id/:stu_id', {//这里传的是排课编号。不是普通的课程编号也不是什么学生编号
				templateUrl: 'views/student/stuCourse.html',
				controller: 'modStuCourse'
			})
			.when('/callback/:course_id/:stu_id', {
				templateUrl: 'views/student/callback.html',
				controller: 'callback'
			})
			.when('/attendList/:course_id', {
				templateUrl: 'views/student/attendList.html',
				controller: 'attendList'
			})
			.when('/stuBusList', {
				templateUrl: 'views/student/stuBusList.html',
				controller: 'stuBusList'
			})
			.when('/addStuToBus', {
				templateUrl: 'views/student/addStuToBus.html',
				controller: 'addStuToBus'
			})
			.when('/busStuAttendList', {
				templateUrl: 'views/student/busStuAttendList.html',
				controller: 'busStuAttendList'
			})
			.when('/busStuAttend/:bus_id/:date', {
				templateUrl: 'views/student/busStuAttend.html',
				controller: 'busStuAttend'
			})
			.when('/report/:course_id/:stu_id', {
				templateUrl: 'views/student/report.html',
				controller: 'report'
			})
	})