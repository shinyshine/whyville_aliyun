'use strict';
 angular.module('homeApp.analysis', ['ngRoute', 'homeApp.analysisService'])
 	.config(function($routeProvider) {
 		$routeProvider
 			.when('/teaSalary', {
 				templateUrl: 'views/analysis/teaSalary.html',
 				controller: 'teaSalary'
 			})
 			//生源校区
 			.when('/schInfo', {
 				templateUrl: 'views/analysis/schInfo.html',
 				controller: 'schInfo'
 			})
 			.when('/stuFeeIncome/:course_id/:type_id', {
 				templateUrl: 'views/analysis/stuFeeIncome.html',
 				controller: 'stuFeeIncome'
 			})
 			.when('/schFeeIncome', {
 				templateUrl: 'views/analysis/schFeeIncome.html',
 				controller: 'schFeeIncome'
 			})
 			.when('/stuBookIncome/:course_id/:type_id', {
 				templateUrl: 'views/analysis/stuBookIncome.html',
 				controller: 'stuBookIncome'
 			})
 			.when('/schBookIncome', {
 				templateUrl: 'views/analysis/schBookIncome.html',
 				controller: 'schBookIncome'
 			})
 			.when('/stuBusIncome', {
 				templateUrl: 'views/analysis/stuBusIncome.html',
 				controller: 'stuBusIncome'
 			})
 			.when('/schBusIncome', {
 				templateUrl: 'views/analysis/schBusIncome.html',
 				controller: 'schBusIncome'
 			})
 	})
