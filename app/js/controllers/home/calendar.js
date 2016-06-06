'use strict';
angular.module('homeApp.home')
	.controller('calendar', function($scope, $rootScope, $cookies, $location, fetchOptions, $routeParams, clickDate, fetchHomeInfo, fetchHomeByYearM, deleteNotice, deleteSche) {
		if($location.search().s_id) {
			$scope.filter = {
				"selectSchool": {
					"id": $location.search().s_id,
					"name": $location.search().s_na,
				},
			}
		}else{
			$scope.filter = {
				"selectSchool": {
					"id": $cookies.get('sch_id'),
					"name": $cookies.get('sch_name'),
				},
			}
		}
		
		fetchOptions('', function(result) {
			$scope.options = {
				"schools": result.schools,
				cur_date: moment().format('YYYY-MM-DD')
			}
		})

		fetchHomeInfo($scope.filter, function(result){
			if(result.status == 2) {
				alert('没有权限查看');
			}else {
				console.log(result);
				$scope.home1 = result;
				
				//for none ntc and none schedule
				$scope.home1.ntc_len = $scope.home1.notice.length;
				$scope.home1.sche_len = $scope.home1.schedule.length;
				var eventArray = $scope.home1.cur_mon_sche;

				calendar(result.cur_mon_sche);
				$scope.$apply();
			}
			
		});

		var curMonth = moment().format('YYYY-MM'),
		    num = 0;

		var calendar = function(eventArray) {
			moment.locale('zh-cn');
			
			//events	
			$('.cal1').clndr({
				events: eventArray,
				clickEvents: {
					click: function(target) {
						var date = target.date._i;
						$scope.filter.date = date;
						$scope.options.cur_date = date;

						//click a day, following event happen
						clickDate($scope.filter, function(result) {
							$scope.home1.notice = result;
							$scope.home1.ntc_len = result.length;
							$scope.$apply();
						});

						var schedules = target.events;
						$scope.home1.schedule = schedules;
						$scope.home1.sche_len = schedules.length;
						
					},
					nextMonth: function () {
						num ++;
						curMonth = moment().add(num, 'months').format('YYYY-MM');

						//we actually can't achieve fetching schedule data by month yet
						fetchByMonth(curMonth);
		            },
		            previousMonth: function () {
		            	num--;
		                curMonth = moment().add(num, 'months').format('YYYY-MM');
						fetchByMonth(curMonth);
		            },
				},
				multiDayEvents: {
					singleDay: 'date',
					endDate: 'endDate',
					startDate: 'startDate'
				},
				showAdjacentMonths: true,
    			adjacentDaysChangeMonth: false
			});
		}

		//click next or pre month, the following event happen
		var fetchByMonth = function(curMonth) {
			var filter = {
				"selectSchool": $scope.filter.selectSchool,
				"month": curMonth
			}
			fetchHomeByYearM(filter, function(result) {
				console.log(result);
				var eventArray = result.cur_mon_sche;
				
				calendar(eventArray);
				$scope.home1.cur_mon_ntc = result.cur_mon_ntc;
				$scope.$apply();
			})
		}

		//employee authority info
		$scope.emp_type = {
			authority: $cookies.get('authority'),
			type: $cookies.get('type')
		}

		$scope.modifySche = function(status, ntc_id) {
			if (status == 0) {
				return false;
			}
			$location.path('/modifySche/' + ntc_id);
		}
		$scope.deleteSche = function(status, ntc_id) {
			if (status == 0) {
				return false;
			}
			//执行删除日程的操作
			alert('delete successfully');
		}

		//删除和修改的权限问题
		$scope.modifyNtc = function(status, ntc_id) {
			if (status == 0) {
				return false;
			}
			$location.path('/modifyNotice/' + ntc_id);
		}
		$scope.deleteNtc = function(status, ntc_id) {
			if (status == 0) {
				return false;
			}
			
		}

		$scope.sendFilter = function() {
			$location.search({s_id: $scope.filter.selectSchool.id, s_na: $scope.filter.selectSchool.name});
		}	
	})