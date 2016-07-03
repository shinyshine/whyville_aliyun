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
'use strict';
angular.module('homeApp.analysis')
	.controller('teaSalary', function($scope, fetchTeaSalary, getYearMonth) {
		$scope.filter = {
			"selectSchool": {
				"id": '1',
				"name": '全部校区'
			},
			"type": {
				"id": 0,
				"name": '全部教师'
			},
			"startTime": {
				"name": moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name": moment().format('YYYY-MM')
			},
		}
		fetchTeaSalary($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			yearMonth: getYearMonth,
			type: [{
				"id": 1,
				"name": '全职老师'
			},{
				"id": 2,
				"name": '兼职老师'
			}]
		}
		
		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchTeaSalary($scope.filter, function(result) {
			$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('stuFeeIncome', function($scope, $location, $routeParams, fetchStuFee, getYearMonth, getYearSessions) {
		console.log($routeParams)
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"year": {
				"name": moment().format('YYYY')
			},
			"session": {
				"id": 1,
				"name": '春季班'
			},
			"startTime": {
				"name": moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name": moment().format('YYYY-MM')
			},
			"courseType": {
				"id": $routeParams.type_id,
				"name": $location.search().c_t
			},
			"course": {
				"id": $routeParams.course_id,
				"name": $location.search().c_n
			}
		}
		fetchStuFee($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYearSessions.year,
			session: getYearSessions.session,
			yearMonth: getYearMonth,
			courseType: options.linkCourse,
		}

		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchStuFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('schFeeIncome', function($scope, $location, fetchSchFee, getYearMonth, getYearSessions) {
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"year": {
				"name": moment().format('YYYY')
			},
			"session": {
				"id": 1,
				"name": '春季班'
			},
			"startTime": {
				"name": moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name": moment().format('YYYY-MM')
			},
			"courseType": {
				"id": '',
				"name": '课程类型'
			},
			"course": {
				"id": '',
				"name": ''
			}
		}
		fetchSchFee($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})
		
		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYearSessions.year,
			session: getYearSessions.session,
			yearMonth: getYearMonth,
			courseType: options.linkCourse,
		}

		$scope.skipToStuCourse = function(course_id, type_id, course_name, course_type) {
			$location.path('/stuFeeIncome/' + type_id + '/' + course_id).search({c_n: course_name, c_t: course_type});
		}

		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchSchFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('stuBookIncome', function($scope, $routeParams, $location, fetchStuBookFee, getYearMonth, getYearSessions) {
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"year": {
				"name": moment().format('YYYY')
			},
			"session": {
				"id": 1,
				"name": '春季班'
			},
			"startTime": {
				"name":moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name":moment().format('YYYY-MM')
			},
			"courseType": {
				"id": '',
				"name": '课程类型'
			},
			"courseType": {
				"id": $routeParams.type_id,
				"name": $location.search().c_t
			},
			"course": {
				"id": $routeParams.course_id,
				"name": $location.search().c_n
			}
		}
		fetchStuBookFee($scope.filter, function(result) {
			console.log(result)
			$scope.$apply(function() {
				$scope.data = result;
			})
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYearSessions.year,
			session: getYearSessions.session,
			yearMonth: getYearMonth,
			courseType: options.linkCourse,
		}

		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchStuBookFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('schBookIncome', function($scope, $location, fetchSchBookFee, getYearMonth, getYearSessions) {
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"year": {
				"name": moment().format('YYYY')
			},
			"session": {
				"id": 1,
				"name": '春季班'
			},
			"startTime": {
				"name": moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name": moment().format('YYYY-MM')
			},
			"courseType": {
				"id": '',
				"name": '课程类型'
			},
			"course": {
				"id": '',
				"name": ''
			}
		}
		fetchSchBookFee($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYearSessions.year,
			session: getYearSessions.session,
			yearMonth: getYearMonth,
			courseType: options.linkCourse,
		}

		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchSchBookFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}

		$scope.skipToStuBook = function(course_id, type_id, course_name, course_type) {
			$location.path('/stuBookIncome/' + type_id + '/' + course_id).search({c_n: course_name, c_t: course_type});

		}
	})

	.controller('stuBusIncome', function($scope, fetchStuBusFee, getYearSessions, getYearMonth, getYears) {
		$scope.filter = {
			"school": {
				"id": 1,
				"name": '全部校区'
			},
			"startTime": {
				"name": moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name": moment().format('YYYY-MM')
			}, 
			"year": {
				"name": moment().format('YYYY')
			}, 
			"busNumber": {
				"id": 0,
				"name": '全部车牌'
			}
		}
		fetchStuBusFee($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYearSessions.year,
			yearMonth: getYearMonth,
			busNumber: options.bus_number
		}

		$scope.sendFilter = function() {
			fetchStuBusFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('schBusIncome', function($scope, fetchSchBusFee, getYearMonth, getYears) {
		$scope.filter = {
			"school": {
				"id": 1,
				"name": '全部校区'
			},
			"startTime": {
				"name": moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name": moment().format('YYYY-MM')
			}, 
			"year": {
				"name": moment().format('YYYY')
			}, 
			"busNumber": {
				"id": 0,
				"name": '全部车牌'
			}
		}
		fetchSchBusFee($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYears,
			yearMonth: getYearMonth,
			busNumber: options.bus_number
		}

		$scope.sendFilter = function() {
			fetchSchBusFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('schInfo', function($scope, fetchSchInfo, getYearSessions) {
		$scope.filter = {
			"school": {
				"id": 1,
				"name": '全部校区'
			},
			"year": {
				"name": moment().format('YYYY')
			},
			"session":  {
				"id": '1',
				"name": '春季班'
			}
		}
		fetchSchInfo($scope.filter, function(result) {
			$scope.data = result;
			$scope.$apply();
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYearSessions.year,
			session: getYearSessions.sessions,
		}

		$scope.sendFilter = function() {
			fetchSchInfo($scope.filter, function(result) {
				console.log(result)
			})
		}
	})