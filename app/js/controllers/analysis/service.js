'use strict';
angular.module('homeApp.analysisService', [])
	.factory('analysisAPI', function(server) {
		return {
			"fetchTeaSalary": server + 'get_teacher_salary',
			"fetchStuFee": server + 'get_course_income',
			"fetchSchFee": server + 'get_course_income2',
			"fetchStuBookFee": server + 'get_book_income',
			"fetchSchBookFee": server + 'get_book_income2',
			"fetchStuBusFee": server + 'get_bus_income',
			"fetchSchBusFee": server + 'get_bus_income2',
			"fetchSchInfo": server + 'session_analysis'
		}
	})
	.factory('fetchTeaSalary', function(analysisAPI) {
		return function(data, callBack) {
			getData(analysisAPI.fetchTeaSalary, callBack, data);
		}
	})

	//获取具体课程收入列表
	.factory('fetchStuFee', function(analysisAPI) {
		return function(data, callBack) {
			getData(analysisAPI.fetchStuFee, callBack, data);
		} 
	})
	//获取整体课程收入列表
	.factory('fetchSchFee', function(analysisAPI) {
		return function(data, callBack) {
			getData(analysisAPI.fetchSchFee, callBack, data);
		}
	})
	
	//获取具体书费收入列表，以学生为主体
	.factory('fetchStuBookFee', function(analysisAPI) {
		return function(data, callBack) {
			getData(analysisAPI.fetchStuBookFee, callBack, data);
		}
	})
	.factory('fetchSchBookFee', function(analysisAPI) {
		
		return function(data, callBack) {
			getData(analysisAPI.fetchSchBookFee, callBack, data);
		}
	})
	.factory('fetchStuBusFee', function(analysisAPI) {
		
		return function(data, callBack) {
			getData(analysisAPI.fetchStuBusFee, callBack, data);
		} 
	})

	//获取校车收入列表，以校车为主体
	.factory('fetchSchBusFee', function(analysisAPI) {
		return function(data, callBack) {
			getData(analysisAPI.fetchSchBusFee, callBack, data);
		}
	})

	//获取校区生源信息
	.factory('fetchSchInfo', function(analysisAPI) {
		return function(data, callBack) {
			getData(analysisAPI.fetchSchInfo, callBack, data);
		}
	})