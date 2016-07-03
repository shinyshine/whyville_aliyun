'use strict';
angular.module('homeApp.operating', ['ngRoute', 'homeApp.operatingService'])
	.config(function($routeProvider) {
			$routeProvider
				.when('/employees', {
		  	  	    templateUrl: 'views/operating/employees.html',
		  	  	    controller: 'employees'
		  	    })
				.when('/addEmp/:emp_id', {
					templateUrl: 'views/operating/addEmp.html',
					controller: 'addEmp'
				})
				.when('/modifyEmp/:emp_id', {
					templateUrl: 'views/operating/modifyEmp.html',
					controller: 'modifyEmp'
				})
				.when('/empInfo/:emp_id', {
					templateUrl: 'views/operating/employeeInfo.html',
					controller: 'empInfo'
				})
				.when('/schoolManage', {
					templateUrl: 'views/operating/schoolManage.html',
					controller: 'SchoolManage'
				})
				.when('/addSchool', {
					templateUrl: 'views/operating/addSchool.html',
					controller: 'AddSchool'
				})
				.when('/modifySchool/:sch_id', {
					templateUrl: 'views/operating/modifySchool.html',
					controller: 'modifySchool'
				})
				.when('/emp_birth', {
					templateUrl: 'views/operating/emp_birthday.html',
					controller: 'empBirth'
				})
		})