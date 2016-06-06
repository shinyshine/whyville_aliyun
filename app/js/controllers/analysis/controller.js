'use strict';
angular.module('homeApp.analysis')
	.controller('teaSalary', function($scope, fetchTeaSalary, getYearMonth, fetchOptions) {
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
		fetchOptions('', function(result) {
			$scope.$apply(function() {
				$scope.options = {
					"schools": result.schools,
					"yearMonth": getYearMonth,
					"type": [{
						"id": 1,
						"name": '全职老师'
					},{
						"id": 2,
						"name": '兼职老师'
					}]
				}
			})
		})
		
		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchTeaSalary($scope.filter, function(result) {
			$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('stuFeeIncome', function($scope, $location, $routeParams, fetchStuFee, fetchOptions, getYearMonth, getYearSessions) {
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
		fetchOptions('', function(result) {
			$scope.$apply(function() {
				$scope.options = {
					"schools": result.schools,
					"year": getYearSessions.year,
					"session": getYearSessions.session,
					"yearMonth": getYearMonth,
					"courseType": result.linkCourse,
				}
			})
		})

		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchStuFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('schFeeIncome', function($scope, $location, fetchSchFee, fetchOptions, getYearMonth, getYearSessions) {
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
		fetchOptions('', function(result) {
			$scope.$apply(function() {
				$scope.options = {
					"schools": result.schools,
					"year": getYearSessions.year,
					"session": getYearSessions.session,
					"yearMonth": getYearMonth,
					"courseType": result.linkCourse,
				}
			})
		})

		$scope.skipToStuCourse = function(course_id, type_id, course_name, course_type) {
			$location.path('/stuFeeIncome/' + type_id + '/' + course_id).search({c_n: course_name, c_t: course_type});
			//$location.path('/stuFeeIncome/2/2')
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
	.controller('stuBookIncome', function($scope, $routeParams, $location, fetchStuBookFee, fetchOptions, getYearMonth, getYearSessions) {
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
		fetchOptions('', function(result) {
			$scope.$apply(function() {
				$scope.options = {
					"schools": result.schools,
					"year": getYearSessions.year,
					"session": getYearSessions.session,
					"yearMonth": getYearMonth,
					"courseType": result.linkCourse,
				}
			})
		})

		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchStuBookFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('schBookIncome', function($scope, $location, fetchSchBookFee, fetchOptions, getYearMonth, getYearSessions) {
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
		fetchOptions('', function(result) {
			$scope.$apply(function() {
				$scope.options = {
					"schools": result.schools,
					"year": getYearSessions.year,
					"session": getYearSessions.session,
					"yearMonth": getYearMonth,
					"courseType": result.linkCourse,
				}
			})
		})

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
	.controller('stuBusIncome', function($scope, fetchStuBusFee, fetchOptions, getYearMonth, getYears) {
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
		fetchOptions('', function(result) {
			$scope.options = {
				"schools": result.schools,
				"year": getYears,
				"yearMonth": getYearMonth,
				"busNumber": result.bus_number
			}
		})

		$scope.sendFilter = function() {
			fetchStuBusFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('schBusIncome', function($scope, fetchSchBusFee, fetchOptions, getYearMonth, getYears) {
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
		fetchOptions('', function(result) {
			console.log(result);
			$scope.options = {
				"schools": result.schools,
				"year": getYears,
				"yearMonth": getYearMonth,
				"busNumber": result.bus_number
			}
		})

		$scope.sendFilter = function() {
			fetchSchBusFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('schInfo', function($scope, fetchSchInfo, fetchOptions, getYearSessions) {
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
			console.log(result);
			$scope.data = result;
			$scope.$apply();
		})
		fetchOptions('', function(result) {
			$scope.options = {
				"schools": result.schools,
				"year": getYearSessions.year,
				"session": getYearSessions.sessions
			}
		})

		$scope.sendFilter = function() {
			fetchSchInfo($scope.filter, function(result) {
				console.log(result)
			})
		}
	})