'use strict';
angular.module('homeApp.student')
	.controller('stuList', function($scope, $location, fecthStudents, createStuId, pagination) {
		//初始化多选框,由于这个页面只有一个多选框，因此数组长度为1
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"page": 1,
			"num": num_per_page
		}
		//about pagination
		$scope.paginationConf = {};
		fecthStudents(function(result) {
			console.log(result)
			$scope.$apply(function() {
				$scope.students = result.result;

				//about pagination
				var total = result.sum;
				$scope.paginationConf = pagination(total);
				$scope.paginationConf.onChange = function() {
					$scope.filter.page = $scope.paginationConf.currentPage;
					$scope.pageChange();
				}
			}) 

		}, $scope.filter)	

		var options = getDataFromStorage('options');
		$scope.options = {
			options: options.schools
		}

		$scope.pageChange = function() {
			fecthStudents(function(result) {
				$scope.students = result.result;

				$scope.$apply();
			}, $scope.filter)	 
		}

		


		$scope.sendFilter = function() {
			$scope.filter.page = 1;
			fecthStudents(function(result) {
				console.log(result)
				$scope.students = result.result;
				$scope.paginationConf.totalItems = result.sum;
				$scope.$apply();
			}, $scope.filter)	 
		}

		$scope.addStu = function() {
			createStuId(function(result) {
				if(result.status == 1) {
					$scope.$apply(function() {
						$location.path('/addStu/' + result.stu_id);
					})
					
				}
				
			});
			
		}
	})

	//那个长长的学生信息的
	.controller('stuInfo', function($scope, $location, $routeParams, fetchStuInfoById) {
		$scope.sidebar = [{
			"name": '基本信息',
			"link": '#basic',
			"default": 1
		},{
			"name": '家长信息',
			"link": '#parent'
		},{
			"name": '学习信息',
			"link": '#learn'
		},{
			"name": '服务信息',
			"link": '#service'
		},{
			"name": '学费信息',
			"link": '#fee'
		}]
		fetchStuInfoById($routeParams, function(result) {
			
			$scope.stuInfo = result;
			var picPath = $scope.stuInfo.stu_basic.stu_pic;
			$scope.stuInfo.stu_basic.stu_pic = API + picPath;
			console.log(result)
			$scope.$apply();
		});

		$scope.pay = function(select_id, price, status) {
			if(status) {
				return false;
			}
			$location.path('/addIncome').search({s_id: select_id, co: price, stu: $routeParams.stu_id})
		}
	})
	.controller('addStu', function($scope, $routeParams, $location, initStuForm, getYearSessions, previewImage, submitStuInfo, uploadPhoto) {
		$scope.sidebar = [{
			"name": '基本信息',
			"link": '#basic',
			"default": 1
		},{
			"name": '家长信息',
			"link": '#parent'
		},{
			"name": '学习信息',
			"link": '#learn'
		}]

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			publics: options.publics,
			sessions: getYearSessions.session,
			years: getYearSessions.year,
			learningStatus: [{
				"id": '1',
				"name": '报名',
			},{
				"id": '2',
				"name": '试听'
			},{
				"id": '3',
				"name": '入学'
			},{
				"id": '4',
				"name": '暂停'
			},{
				"id": '5',
				"name": '退学'
			}]
		}
		
		$scope.stuInfo = initStuForm.fetchData($routeParams.stu_id);

		//图片预览效果
		previewImage(function(ext_name) {
			$scope.stuInfo.stu_basic.stu_pic.ext_name = ext_name;
			$scope.$apply();
		})
		$scope.submitStuInfo = function(valid) {
			if(valid) {
				console.log($scope.stuInfo);
				submitStuInfo($scope.stuInfo, function(result) {
					callbackAlert(result.status, '添加成功');
					if(result.status == 1) {
						$scope.$apply(function() {
							$location.path('/courseList');
						})
						
					}else{
						alert('出现错误，稍后重试');
					}
				});	
			}else{
				alert('请检查是否有必须项未填');
			}		
		}
	})

	.controller('modifyStuInfo', function($scope, $timeout, $location, $routeParams, fetchStuInfoById, getYearSessions, modifyStuInfo) {
		$scope.sidebar = [{
			"name": '基本信息',
			"link": '#basic',
			"default": 1
		},{
			"name": '家长信息',
			"link": '#parent'
		},{
			"name": '学习信息',
			"link": '#learn'
		}]

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			publics: options.publics,
			sessions: getYearSessions.session,
			years: getYearSessions.year,
			learningStatus: [{
				"id": '1',
				"name": '报名',
			},{
				"id": '2',
				"name": '试听'
			},{
				"id": '3',
				"name": '入学'
			},{
				"id": '4',
				"name": '暂停'
			},{
				"id": '5',
				"name": '退学'
			}]
		}
		
		fetchStuInfoById($routeParams, function(result) {
			console.log(result);
			$scope.stuInfo = result;
			var picPath = $scope.stuInfo.stu_basic.stu_pic;
			$scope.stuInfo.stu_basic.stu_pic = API + picPath;
			$scope.$apply();
		})
		
		$scope.submitStuInfo = function() {
			modifyStuInfo($scope.stuInfo, function(result) {
				callbackAlert(result.status, '修改成功');
				if(result.status == 1) {
					window.location.href = ROOT + 'stuList';
				}
			})
		}
		$scope.pay = function(select_id, price, status) {
			if(status) {
				return false;
			}
			$location.path('/addIncome').search({s_id: select_id, co: price, stu: $routeParams.stu_id});
		}
	})
