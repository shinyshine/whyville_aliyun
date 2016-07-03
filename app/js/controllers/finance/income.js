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
	.controller('modIncome', function($scope, $routeParams, fetchIncomeById, getDate) {
		var options = getDataFromStorage('options');
		$scope.options = {
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
			}],
			date: getDate
		}
		

		fetchIncomeById($routeParams, function(result) {
			console.log(result);
		})

		$scope.submitData = function() {
			console.log($scope.formData);
		}
	})
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