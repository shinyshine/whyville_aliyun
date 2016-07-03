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
'use strict';
angular.module('homeApp.finance')
	.controller('appList', function($scope, getYearMonth, fetchAppList, pagination) {
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
					$scope.pageChange();
				}
			})
		})

		$scope.pageChange = function() {
			fetchAppList($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.app = result.result;
				})
			})
		}

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			type: [{
				"id": 0,
				"name": '未付款'
			},{
				"id": 1,
				"name": '已付款'
			}],
			yearMonth: getYearMonth
		}

		$scope.sendFilter = function() {
			$scope.filter.page = 1;
			console.log($scope.filter);
			fetchAppList($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.paginationConf.totalItems = result.total.num;
					$scope.app = result.result;
				})
			})
		}
	})

	//对申请表进行付款
	.controller('payForApp', function($scope, $location, $routeParams, fetchAppById, payForApp) {
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

		var options = getDataFromStorage('options');
		$scope.options = {
			pay_method: options.pay_method,
			pay_type: options.pay_type
		}

		$scope.payForApp = function() {
			//http server  post postData
			console.log($scope.postData);
			payForApp($scope.postData, function(result) {
				callbackAlert(result.status, '成功付款');
				$location.path('/appList');
			})
		}
	})

	.controller('checkApp', function($scope, $routeParams, fetchAppById) {
		fetchAppById($routeParams, function(result) {
			console.log(result);
			$scope.$apply(function() {
				$scope.appForm = result;
			})
		})
	})
'use strict';
angular.module('homeApp.finance')
	.controller('incomeList', function($scope, $cookies, getYearMonth, fetchIncomeList, pagination, deleteIncome) {
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
			"payMethod": {
				"id": '',
				"name": '支付方式'
			},
			"payTo": {
				"id": '',
				"name": ''
			},
			"type": {
				"id": 0,
				"name": '全部类型' 
			},
			"page": 1,
			"num": num_per_page
		}

		//about pagination
		$scope.paginationConf = {};

		fetchIncomeList($scope.filter, function(result) {
			console.log(result);
			$scope.$apply(function() {
				$scope.incomeList = result;
				//about pagination
				var total = result.total.number;

				$scope.paginationConf = pagination(total);
				$scope.paginationConf.onChange = function() {
					$scope.filter.page = $scope.paginationConf.currentPage;
					$scope.pageChange();
				}
			})
		})

		
		var options = getDataFromStorage('options');
		$scope.options = {
			yearMonth: getYearMonth,
			schools: options.schools,
			pay_method: options.pay_method,
			type: [{
				"id": 0,
				"name": '全部类型'
			},{
				"id": 1,
				"name": '学费'
			},{
				"id": 2,
				"name": '书费'
			},{
				"id": 3,
				"name": '校车费'
			},{
				"id": 4,
				"name": '其他'
			}]
		}

		$scope.pageChange = function() {
			fetchIncomeList($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.incomeList = result;
				})
			})
		}

		$scope.sendFilter = function() {
			$scope.filter.page = 1;
			fetchIncomeList($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.incomeList = result;
					$scope.paginationConf.totalItems = result.sum;
				})
			})
		}

		$scope.deleteIncome = function(in_id) {
			var data = {
				in_id: in_id
			}

			deleteIncome(data, function(result) {
				callbackAlert(result.status, '删除成功');
			})
		}
	})

	//考虑不做修改  只做删除  所以下面作废
	// .controller('modIncome', function($scope, $routeParams, fetchIncomeById, getDate) {
	// 	var options = getDataFromStorage('options');
	// 	$scope.options = {
	// 		schools: options.schools,
	// 		pay_method: options.pay_method,
	// 		type: [{
	// 			"id": 0,
	// 			"name": '全部类型'
	// 		},{
	// 			"id": 1,
	// 			"name": '学费'
	// 		},{
	// 			"id": 2,
	// 			"name": '书费'
	// 		},{
	// 			"id": 3,
	// 			"name": '校车费'
	// 		},{
	// 			"id": 4,
	// 			"name": '其他'
	// 		}],
	// 		date: getDate
	// 	}
		

	// 	fetchIncomeById($routeParams, function(result) {
	// 		console.log(result);
	// 	})

	// 	$scope.submitData = function() {
	// 		console.log($scope.formData);
	// 	}
	// })


	.controller('addIncome', function($scope, $location, initAddIncomeForm, addIncome, getDate, fetchCourseByStu) {
		var search = $location.search(),
			price = search.co,
			s_id = search.s_id,
			stu_id = search.stu;
		$scope.formData = initAddIncomeForm(price, s_id, stu_id);

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: result.schools,
			bus_number: result.bus_number,
			course: result.course,
			pay_method: result.pay_method,
			type: [{
				"id": 1,
				"name": '学费'
			},{
				"id": 2,
				"name": '书费'
			},{
				"id": 3,
				"name": '校车费'
			},{
				"id": 4,
				"name": '其他'
			}],
			date: getDate
		}

		//控制学生信息的显示与隐藏
		$scope.showStu = {
			bus: 1,
			course: 1
		}

		$scope.incomeType  = function() {
			if(!stu_id) {
				var in_type = $scope.formData.type.id;
				if(in_type == 1 || in_type == 2) {//学费或书费
					$scope.showStu.bus = 1;
					$scope.showStu.course = 0;
					console.log($scope.showStu)
				}else if(in_type == 3) { //校车费
					$scope.showStu.course = 1;
					$scope.showStu.bus = 0;
					console.log($scope.showStu)
				}else{
					$scope.showStu.course = 1;
					$scope.showStu.bus = 1;
				}
			}
			
		}

		//填写完学号，下拉学号后面的表单，去后台获取该学生选过的课程
		$scope.downClick = function() {
			//var stu_id = $scope.formData.other_data.stu_id;
			var stu = {
				stu_id: $scope.formData.other_data.stu_id
			}
			fetchCourseByStu(stu, function(result) {
				$scope.options.course = result;
				$scope.$apply();
			})
		}

		$scope.addIncome = function() {
			console.log($scope.formData)
			addIncome($scope.formData, function(result) {
				callbackAlert(result.status, '成功添加收入');
 			})
			
		}
	})
'use strict';
angular.module('homeApp.finance')
	.controller('payList', function($scope, $cookies, getYearMonth, fetchPayList, pagination) {
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
			"num": num_per_page
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

		var options = getDataFromStorage('options');
		$scope.options = {
			yearMonth: getYearMonth,
			schools: options.schools,
			pay_method: options.pay_method,
			pay_type: options.pay_type
		}

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
		}
	})
	.controller('modPay', function($scope, $routeParams, fetchPayById, modPay) {

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			pay_type: options.pay_type,
			pay_method: options.pay_method
		}

		fetchPayById($routeParams, function(result) {
			$scope.$apply(function() {
				$scope.formData = result;
			})
		})

		$scope.addPay = function() {
			modPay($scope.formData, function(result) {
				callbackAlert(result.status, '修改成功');
				if(result.status == 1) {
					window.location.href = ROOT + 'payList';
				}
			})
		}
	})
	.controller('addPay', function($scope, $location, initAddPayForm, addPay, getDate) {
		$scope.formData = initAddPayForm;

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			pay_method: options.pay_method,
			pay_type: options.pay_type,
			date: getDate
		}

		$scope.addPay = function() {
			addPay($scope.formData, function(result) {
				callbackAlert(result.status, '成功添加支出');
				if(result.status == 1) {
					window.location.href = ROOT + 'payList';
				}
			})
		}
	})