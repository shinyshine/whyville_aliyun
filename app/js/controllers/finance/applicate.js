'use strict';
angular.module('homeApp.finance')
	.controller('appList', function($scope, getYearMonth, fetchOptions, fetchAppList, pagination) {
		$scope.filter = {
			"selectSchool": {
				"id": '1',
				"name": '全部校区'
			},
			"startTime": {
				"name": moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name": moment().format('YYYY-MM')
			},
			"type": {
				"id": 0,
				"name": '未付款'
			},
			"page": 1,
			"num": num_per_page
		}
		$scope.paginationConf = {};

		fetchAppList($scope.filter, function(result) {
			console.log(result);
			$scope.$apply(function() {
				$scope.app = result.result;
				//about pagination
				var total = result.total.number;
				$scope.paginationConf = pagination(total);
				$scope.paginationConf.onChange = function() {
					$scope.filter.page = $scope.paginationConf.currentPage;
					$scope.sendFilter();
				}
			})
		})

		fetchOptions('', function(result) {
			$scope.options = {
				"schools": result.schools,
				"type": [{
					"id": 0,
					"name": '未付款'
				},{
					"id": 1,
					"name": '已付款'
				}],
				"yearMonth": getYearMonth
			}
		})
		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchAppList($scope.filter, function(result) {
				console.log(result);
				$scope.$apply(function() {
					$scope.app = result.result;
				})
			})
		}
	})

	//对申请表进行付款
	.controller('payForApp', function($scope, $routeParams, fetchAppById, fetchOptions, payForApp) {
		// $scope.data = fetchAppById($routeParams);
		$scope.autoData = {
			pay_date: moment().format('YYYY-MM-DD')
		}
		fetchAppById($routeParams, function(result) {
			console.log(result);
			$scope.$apply(function() {
				$scope.appForm = result;
			})
		})

		$scope.postData = {
			"app_id": $routeParams.app_id,
			"type":{
				"payFisrt": {
					"id": '', 
					"name": ''
				},
				"paySec": {
					"id": '',
					"name": ''
				},
			},
			"method": {
				"payMethod": {
					"id": '',
					"name": ''
				},
				"payTo": {
					"id": '',
					"name": ''
				}
			} 
		}

		fetchOptions('', function(result) {
			$scope.$apply(function() {
				$scope.options = {
					"pay_method": result.pay_method,
					"pay_type": result.pay_type
				}
			})
		})

		$scope.payForApp = function() {
			//http server  post postData
			console.log($scope.postData);
			payForApp($scope.postData, function(result) {
				if(result.status) {
					alert('成功付款');
				}
			})
		}
	})

	.controller('checkApp', function($scope, $routeParams, fetchAppById) {
		console.log($routeParams)
		fetchAppById($routeParams, function(result) {
			console.log(result);
			$scope.$apply(function() {
				$scope.appForm = result;
			})
		})
	})