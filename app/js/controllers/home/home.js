'use strict';
angular.module('homeApp.home', ['ngRoute', 'homeApp.homeService'])
	.config(function($routeProvider) {
		$routeProvider
			
			.when('/addNotice', {
				templateUrl: 'views/home/editNotice.html',
				controller: 'addNotice'
			})
			.when('/addSchedule', {
				templateUrl: 'views/home/editSchedule.html',
				controller: 'addSchedule'
			})
			.when('/modifyNotice/:ntc_id', {
				templateUrl: 'views/home/editNotice.html',
				controller: 'modifyNotice'
			})
			.when('/modifySche/:ntc_id', {
				templateUrl: 'views/home/editSchedule.html',
				controller: 'modifySchedule'
			})
			.when('/notice/:ntc_id', {
				templateUrl: 'views/home/notice.html',
				controller: 'notice'
			})
			.when('/applications', {
				templateUrl: 'views/home/applications.html',
				controller: 'applications'
			})
			.when('/applyfor', {
				templateUrl: 'views/home/applyfor.html',
				controller: 'applyfor'
			})
			.when('/acceptApp/:app_id', {
				templateUrl: 'views/home/acceptApp.html',
				controller: 'acceptApp'
			})
			.when('/modifyApp/:app_id', {
				templateUrl: 'views/home/modApp.html',
				controller: 'modifyApp'
			})
			.when('/login', {
				templateUrl: 'views/home/login.html',
				controller: 'login'
			})
			.when('/modifyPwd', {
				templateUrl: 'views/public/modifyPwd.html',
				controller: 'modifyPwd'
			})
	})