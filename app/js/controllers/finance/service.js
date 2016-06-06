'use strict';
angular.module('homeApp.financeService', [])
	.factory('financeAPI', function(server) {
		return {
			"fetchPayList": server + 'get_cost',
			"addPay": server + 'add_cost',
			"fetchIncomeList": server + 'get_income',
			"addIncome": server + 'add_income',
			"fetchAppList": server + 'get_application2',
			"payForApp": server + 'accept_application',
			"fetchAppById": server + 'get_application_information',
			"payForApp": server + 'accept_application',
			"modPay": server + 'change_cost',
			"modifyAccount": server + 'change_balance',
			"fetchAccounts": server + 'get_balance',
			"daily": server + 'get_cost_income',
			"modIncome": server + 'change_income',
			"deleteIncome": server + 'delete_income',
		}
	})

	//删除收入记录
	.factory('deleteIncome', function(financeAPI) {
		return function(data, callBack) {
			getData(financeAPI.deleteIncome, callBack, data);
		}
	})
	.factory('fetchDaily', function(financeAPI) {
		return function(data, callBack) {
			getData(financeAPI.daily, callBack, data);
		}
	})
	.factory('fetchAccounts', function(financeAPI) {
		return function(data, callBack) {
			getData(financeAPI.fetchAccounts, callBack, data);
		}
	})
	.factory('fetchPayList', function(financeAPI) {
		return function(data, callBack) {
			getData(financeAPI.fetchPayList, callBack, data);
		}
	})
	.factory('initAddPayForm', function() {
		return {
				"school": {
					"id": '',
					"name": ''
				},
				"pay_date": moment().format('YYYY-MM-DD'),
				"pay_type": {
					"id": '',
					"name": ''
				},
				"pay_sec_type": {
					"id": '',
					"name": ''
				},
				"pay_method": {
					"id": '',
					"name": ''
				},
				"pay_to": {
					"id": '',
					"name": ''
				},
				"cost": '',
				"app_state": 0, //是否申请
				"abstraction": ''
			}
	})

	.factory('addPay', function(financeAPI) {
		return function(data, callBack) {
			postData(financeAPI.addPay, data, callBack);
		}
	})
	.factory('fetchPayById', function(financeAPI) {
		return function(data, callBack) {
			getData(financeAPI.modPay, callBack, data);
		}
	})
	.factory('modPay', function(financeAPI) {
		return function(data, callBack) {
			postData(financeAPI.modPay, data, callBack);
		}
	})

	.factory('fetchIncomeList', function(financeAPI) {
		return function(data, callBack) {
			getData(financeAPI.fetchIncomeList, callBack, data);
		}
	})
	.factory('initAddIncomeForm', function(financeAPI, $cookies) {
		return function(price, s_id, stu, bus_id) {
			return {
				// "in_id": '',
				"school": {
					"id": '',
					"name": ''
				},
				"other_data": {
					"course": {
						"id": s_id,
						"name": ''
					},
					"bus": {
						"id": s_id,
						"name": ''
					},
					"stu_id": stu
				},
				"in_date": moment().format('YYYY-MM-DD'),
				"type": {
					"id": '',
					"name": ''
				},
				"pay_method": {
					"id": '',
					"name": ''
				},
				"pay_to": {
					"id": '',
					"name": ''
				},
				"sum": price,
				"abstraction": '',
				"charge_name": $cookies.get('user_name'),
				"receipt_no": ''
			}
		}
	})

	.factory('addIncome', function(financeAPI) {
		return function(data, callBack) {
			postData(financeAPI.addIncome, data, callBack);
		}
	})

	.factory('fetchIncomeById', function(financeAPI) {
		return function(data, callBack) {
			getData(financeAPI.modIncome, callBack, data);
		}
	})
	.factory('fetchAppList', function(financeAPI) {
		return function(data, callBack) {
			getData(financeAPI.fetchAppList, callBack, data);
		}
	})

	.factory('payForApp', function(financeAPI) {
		return function(data, callBack) {
			postData(financeAPI.payForApp, data, callBack);
		}
	})

	//获取某申请表的信息
	.factory('fetchAppById', function(financeAPI) {
		return function(data, callBack) {
			getData(financeAPI.fetchAppById, callBack, data);
		}
	})

	.factory('modifyAccount', function(financeAPI) {
		return function(data, callBack) {
			postData(financeAPI.modifyAccount, data, callBack);
		}
	})