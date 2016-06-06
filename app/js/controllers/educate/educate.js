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