'use strict';
angular.module('homeApp.home')
	.controller('applications', function($scope, $cookies, $location, fetchOptions, fetchApps, pagination) {
		var emp_type = {
			type: $cookies.get('type'),
			user_id: $cookies.get('user_id')
		};
		if(emp_type.type == 3 || emp_type.type == 4) {
			alert('没有访问权限');
			$location.path('/' + emp_type.user_id)
		}
		$scope.emp_type = {
			authority: $cookies.get('authority')
		}
		console.log($scope.emp_type);
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"type": {
				"id": 0,
				"name": '全部申请表'
			},
			"page": 1,
			"num": 3
		}
		fetchOptions('', function(result) {
			$scope.$apply(function() {
				$scope.options = {
					"schools": result.schools,
					"app_status": [{
						"id": '0',
						"name": '全部申请表'
					},{
						"id": '1',
						"name": '已审核申请表'
					},{
						"id": '2',
						"name": '待审核申请表'
					}]
				}
			})
		})
		
		

		//about pagination
		$scope.paginationConf = {};

		fetchApps($scope.filter, function(result) {
			console.log(result);
			$scope.$apply(function() {
				$scope.applicate = result.result;			
				
				//pagination
				var total = result.sum;
				$scope.paginationConf = pagination(total);

				$scope.paginationConf.onChange = function() {
					$scope.filter.page = $scope.paginationConf.currentPage;
					$scope.pageChange();
				}
			})
		});
		



		$scope.accept = function(id, status) {
			if($scope.emp_type.authority != 0) {
				return false;
			}
			//发送请求同意审核
			$location.path('/acceptApp/' + id).search({status: status});
		}	

		$scope.modify = function(modify, id) {
			if(modify == 0) {
				return false;
			}
			$location.path('/modifyApp/' + id);

		}
		
		$scope.pageChange = function() {
			fetchApps($scope.filter, function(result) {
				$scope.applicate = result.result;
				$scope.$apply();
			});
		}

		$scope.sendFilter = function() {
			$scope.filter.page = 1;
			fetchApps($scope.filter, function(result) {
				console.log(result);
				$scope.applicate = result.result;
				//pagination
				var total = result.sum;
				$scope.paginationConf = pagination(total);
				$scope.$apply();
			});
		}
	})
    .controller('applyfor', function($scope, $cookies, $location, initAppForm, addApp) {
    	var emp_type = {
			type: $cookies.get('type'),
			user_id: $cookies.get('user_id')
		};
		if(emp_type.type == 3 || emp_type.type == 4) {
			alert('没有访问权限');
			$location.path('/' + emp_type.user_id)
		}else {
			$scope.appForm = initAppForm;
	    	$scope.addItem = function() {
	    		var itemModel = {
					"app_content": '',
					"app_per": '',
					"app_num": ''
				}
	    		$scope.appForm.app.push(itemModel);
	    		console.log($scope.appForm);
	    	}


	    	$scope.total = {
	    		total_price: 0
	    	}
	    	$scope.countTotal = function() {
	    		$scope.total.total_price = 0;
	    		var total = $scope.total.total_price;
	    		
	    		if(isNaN(total)) {
	    			console.log("NaN");
	    			$scope.total.total_price = 0;
	    		}
	    		for(var i = 0, len = $scope.appForm.app.length; i < len; i ++) {
		    		$scope.total.total_price += $scope.appForm.app[i].app_per * $scope.appForm.app[i].app_num;
		    	}
	    	}
	    	

	    	$scope.submitApp = function() {
	    		console.log($scope.appForm);
				addApp($scope.appForm, function(result) {
	    			if(result.status) {
	    				window.location.href = ROOT + 'applications';
	    			}
	    		})
	    	}
		}
    	
    })
    .controller('modifyApp', function($scope, $location, $routeParams, fetchApplyById, modifyApp) {
    	fetchApplyById($routeParams, function(result) {
    		$scope.appForm = result;
    		$scope.total_price = 0;
    		for(var i = 0, len = $scope.appForm.app.length; i < len; i ++) {
	    		$scope.total_price += $scope.appForm.app[i].app_per * $scope.appForm.app[i].app_num;
	    	}
    		$scope.$apply();
    		console.log($scope.appForm);
    	});

    	

    	$scope.addItem = function() {
    		var itemModel = {
				"app_content": '',
				"app_per": '',
				"app_num": ''
			}
    		$scope.appForm.app.push(itemModel);
    		console.log($scope.appForm);
    	}


    	//$scope.total_price = 0;

    	$scope.countTotal = function() {
    		if(isNaN($scope.total_price)) {
    			$scope.total_price = 0;
    		}
    		for(var i = 0, len = $scope.appForm.app.length; i < len; i ++) {
	    		$scope.total_price += $scope.appForm.app[i].app_per * $scope.appForm.app[i].app_num;
	    	}
    	}
    	$scope.submitApp = function() {
    		var data = {
    			app_id: $routeParams.app_id,
    			app_title: $scope.appForm.user.app_title,
    			app: $scope.appForm.app
    		}
    		modifyApp(data, function(result) {
    			if(result.status) {
    				alert('修改成功');
    			}
    		})
    	}
    })
    .controller('acceptApp', function($scope, $location, $routeParams, fetchApplyById, acceptApp) {
    	fetchApplyById($routeParams, function(result) {
    		$scope.appForm = result;
    		$scope.$apply();
    		console.log($scope.appForm);
    	});

    	$scope.autoData = {
    		"date": moment().format('YYYY-MM-DD'),
    		"sign_name": $scope.user.user_name
    	}
    	$scope.postData = {
    		"app_id": $routeParams.app_id,
    		"status": $location.search().status,
    		"opinion": '',
    	}

    	$scope.acceptApp = function() {
    		console.log($scope.postData);
    		acceptApp($scope.postData, function(result) {
    			if(result.status == 1) {
    				alert('审批成功');
    				//window.location.href = ROOT + 'applications';
    			}else{
    				alert('操作失败，请尝试重新提交');
    			}
    		})
    	}

    	
    })