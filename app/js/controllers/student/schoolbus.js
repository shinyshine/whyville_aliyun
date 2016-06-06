'use strict';
angular.module('homeApp.student')
	.controller('stuBusList', function($scope, fetchOptions, getYearSessions, fetchStuBus, deleteBus) {
		$scope.filter = {
			"selectSchool": {
				"id": '1',
				"name": '全部校区'
			},
			"selectBus": {
				"id": '0',
				"name": '全部车牌'
			},
			"type": {
				"id": '1',
				"name": '接'
			},
			"selectSession": {
				"id": 0,
				"name": '全部季度'
			},
			"selectYear": {
				"name": '2016'
			},
		}
		fetchOptions('', function(result) {
			console.log(result)
			$scope.options = {
				"schools": result.schools,
				"bus_number": result.bus_number,
				"type": [{
					"id": '0',
					"name": '送'
				}, {
					"id": '1',
					"name": '接'
				}],
				"years": getYearSessions.year,
				"sessions": getYearSessions.session
			}
		})
		fetchStuBus($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.stuBus = result;
			})
		})

		//$scope.stuBus = fetchStuBus($scope.filter);

		$scope.sendFilter = function() {
			fetchStuBus($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.stuBus = result;
				})
			})
		}

		$scope.deleteBus = function(ser_id) {
			var data = {
				ser_id: ser_id
			}
			deleteBus(data, function(result) {
				if(result.status == 1) {
					alert('删除成功');
				}else{
					alert('无法删除');
				}
			})
		}
	})
	.controller('addStuToBus', function($scope, addStuToBus, getYearSessions, getStuName, fetchOptions, getWeekDays, initAddToBusForm) {
		fetchOptions('', function(result) {
			$scope.options = {
				"type": [{
					"id": '0',
					"name": '送'
				}, {
					"id": '1',
					"name": '接'
				}],
				"years": getYearSessions.year,
				"sessions": getYearSessions.session,
				"bus_number": result.bus_number,
				"discount": [{
					"id": 0,
					"name": '打折'
				},{
					"id": 1,
					"name": '减价'
				}],
				"pay_method": result.pay_method,
				"weekdays": getWeekDays
			}
		})

		//init form data, almost empty value
		$scope.formData = initAddToBusForm;

		//get student's name by his id
		$scope.getStuName = function() {
			var stuId = {
				stu_id: $scope.formData.stu_id
			}

			$scope.formData.stu_name = getStuName().stu_name;
			// getStuName(stuId, function(result) {
			// 	console.log(result)
			// 	$scope.formData.stu_name = result.stu_name;
			// })
		}


		$scope.submitData = function() {
			var data = $scope.formData;
			console.log(data);
			if(data.bus_number.id && data.type.id && data.discount_type.id && data.session.name && data.year.name) {
				
				//filter time format
				var week = data.weekdays;

				for(var item in week) {
					var cur = week[item];
					if(cur.choose) {
						//console.log(week[item]);
						if(!isTime(cur.time)) {
							alert('请使用正确的时间格式, 12:00');
							return false;
						}
					}
				}

				addStuToBus($scope.formData, function(result) {
					if(result.status == 1) {
						alert('操作成功');
					}
				})
			}else{
				alert('请完善信息');
			}	
		}
	})
	.controller('modStuBus', function($scope) {
		//修改约车记录
	})
	.controller('busStuAttendList', function($scope, fetchOptions, getYears, fetchBusRecord) {
		$scope.filter = {
			"selectBus": {
				"id": '0',
				"name": '全部车牌'
			},
			"date": {
				"year": moment().format('YYYY'),
				"month": moment().format('MM'),
				"day": moment().format('DD')
			}
			// "selectYear": {
			// 	"name": new Date().getFullYear()
			// }
		}
		fetchOptions('', function(result) {
			$scope.options = {
				"bus_number": result.bus_number,
				"years": getYears
			}
		})

		fetchBusRecord($scope.filter, function(result) {
			console.log(result);
			$scope.data = result;
			$scope.$apply();
		})

		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchBusRecord($scope.filter, function(result) {
				$scope.data = result;
				$scope.$apply();
			})
		}
	})
	.controller('busStuAttend', function($scope, $routeParams, fetchBusRecordById, modBusStuAttend) {
		$scope.attendType = [{
			"id": '1',
			"name": '是'
		},{
			"id": '0',
			"name": '否'
		}]
		$scope.filter = {
			"bus": {
				"id": $routeParams.bus_id
			},
			"date": $routeParams.date,
			"type": {
				"id": -1,
				"name": '接或送'
			}
		}
		$scope.options = {
			"type": [{
				"id": -1,
				"name": '接或送'
			},{
				"id": '0',
				"name": '送'
			},{
				"id": '1',
				"name": '接'
			}]
		}

		//$scope.data = fetchBusRecordById($routeParams);
		fetchBusRecordById($scope.filter, function(result) {
			console.log(result)
			$scope.busAttend = result;
			$scope.$apply();
		})

		$scope.modify = function(index) {
			var cur = $scope.busAttend.list[index],
				status = cur.isEditing;

			if(status) {
				var data = {
					"ser_id": {
						"id": cur.ser_id
					},
					"state": cur.attend_state
				}
				//console.log('发送请求给后台，修改出勤状况');
				modBusStuAttend(data, function(result) {
					if(result.status) {
						alert('考勤成功');
					}
				})
			}
			$scope.busAttend.list[index].isEditing = !status;
		}

		$scope.sendFilter = function() {
			fetchBusRecordById($scope.filter, function(result) {
				$scope.busAttend = result;
				$scope.$apply();
			})
		}
	})