'use strict';
angular.module('homeApp.finance', ['ngRoute', 'homeApp.financeService'])
	.config(function($routeProvider) {
		$routeProvider
			.when('/payList', {
				templateUrl: 'views/finance/payList.html',
				controller: 'payList'
			})
			.when('/appList', {
				templateUrl: 'views/finance/appList.html',
				controller: 'appList'
			})
			.when('/incomeList', {
				templateUrl: 'views/finance/income.html',
				controller: 'incomeList'
			})
			.when('/addPay', {
				templateUrl: 'views/finance/payForm.html',
				controller: 'addPay'
			})
			.when('/modPay/:pay_id', {
				templateUrl: 'views/finance/payForm.html',
				controller: 'modPay'
			})
			.when('/modIncome/:in_id', {
				templateUrl: 'views/finance/incomeForm.html',
				controller: 'modIncome'
			})
			.when('/addIncome', {
				templateUrl: 'views/finance/incomeForm.html',
				controller: 'addIncome'
			})
			.when('/payForApp/:app_id', {
				templateUrl: 'views/finance/applicate.html',
				controller: 'payForApp'
			})
			.when('/daily', {
				templateUrl: 'views/finance/daily.html',
				controller: 'daily'
			})
			.when('/account', {
				templateUrl: 'views/finance/account.html',
				controller: 'account'
			})
			.when('/checkApp/:app_id', {
				templateUrl: 'views/finance/application.html',
				controller: 'checkApp'
			})
	})

	//财务日报
	.controller('daily', function($scope, fetchDaily) {
		fetchDaily('', function(result) {
			$scope.daily = result;
			$scope.$apply();
		})
	})
	//账户余额
	.controller('account', function($scope, fetchAccounts, modifyAccount) {
		$scope.options = {
			"method": [{
				"id": 0,
				"name": '现金'
			},{
				"id": 1,
				"name": '刷卡'
			}]
		}

		$scope.filter = {
			"method": {
				"id": 0,
				"name": '现金'
			}
		}
	
		fetchAccounts($scope.filter, function(result) {
			console.log(result);
			$scope.account = result;
			$scope.$apply();
		})

		$scope.modify = function(index) {
			var cur = $scope.account.list,
				status = cur[index].isEditing;

			if(status) {	
				modifyAccount(cur[index], function(result) {
					if(result.status) {
						alert('修改成功');
					}
				})
			}
			$scope.account.list[index].isEditing = !status;
		}

		$scope.sendFilter = function() {
			fetchAccounts($scope.filter, function(result) {
				$scope.account = result;
				$scope.$apply();
			})
		}
	})