'use strict';
angular.module('homeApp.finance')
	.controller('payList', function($scope, $cookies, getYearMonth, fetchOptions, fetchPayList, pagination) {
		//判断是否是财务，不是的话视图上的添加收入和支出记录按钮不显示
		$scope.emp_type = {
			type: $cookies.get('type')
		}
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
			"payFisrt": {
				"id": '', 
				"name": '费用类型'
			},
			"paySec": {
				"id": '',
				"name": ''
			},
			"payMethod": {
				"id": '',
				"name": '支付方式'
			},
			"payTo": {
				"id": '',
				"name": ''
			},
			"page": 1,
			"num": 3
		}
		//about pagination
		$scope.paginationConf = {};

		fetchPayList($scope.filter, function(result) {
			console.log(result);
			$scope.$apply(function() {
				$scope.payList = result;

				//about pagination
				var total = result.total.number;
				$scope.paginationConf = pagination(total);
				$scope.paginationConf.onChange = function() {
					$scope.filter.page = $scope.paginationConf.currentPage;
					$scope.pageChange();
				}
			})
		})

		fetchOptions('', function(result) {
			$scope.options = {
				"yearMonth": getYearMonth,
				"schools": result.schools,
				"pay_method": result.pay_method,
				"pay_type": result.pay_type
			}
			$scope.$apply();
		})

		$scope.pageChange = function() {
			fetchPayList($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.payList = result;
				})
			})	 
		}

		$scope.sendFilter = function() {
			$scope.filter.page = 1;
			fetchPayList($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.payList = result;
					$scope.paginationConf.totalItems = result.sum;
				})
			})
			console.log($scope.paginationConf)
		}
	})
	.controller('modPay', function($scope, $routeParams, fetchOptions, fetchPayById, modPay) {
		fetchOptions('', function(result) {
			$scope.$apply(function() {
				$scope.options = {
					"schools": result.schools,
					"pay_type": result.pay_type,
					"pay_method": result.pay_method
				}
			})
		})

		fetchPayById($routeParams, function(result) {
			$scope.$apply(function() {
				$scope.formData = result;
			})
		})

		$scope.addPay = function() {
			modPay($scope.formData, function(result) {
				if(result.status) {
					alert('修改成功');
					window.location.href = ROOT + 'payList';
				}
			})
		}
	})
	.controller('addPay', function($scope, fetchOptions, initAddPayForm, addPay, getDate) {
		$scope.formData = initAddPayForm;
		fetchOptions('', function(result) {
			$scope.options = {
				"schools": result.schools,
				"pay_method": result.pay_method,
				"pay_type": result.pay_type,
				"date": getDate
			}
			$scope.$apply();
		})

		$scope.addPay = function() {
			console.log($scope.formData);
			addPay($scope.formData, function(result) {
				if(result.status) {
					alert('成功添加支出');
				}
			})
		}
	})