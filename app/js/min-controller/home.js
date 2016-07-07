'use strict';
angular.module('homeApp.home', ['ngRoute', 'homeApp.homeService'])
	.config(function($routeProvider) {
		$routeProvider
			
			.when('/addNotice', {
				templateUrl: 'views/home/editNotice.html',
				controller: 'addNotice'
			})
			.when('/addSchedule', {
				templateUrl: 'views/home/editSchedule.html',
				controller: 'addSchedule'
			})
			.when('/modifyNotice/:ntc_id', {
				templateUrl: 'views/home/editNotice.html',
				controller: 'modifyNotice'
			})
			.when('/modifySche/:ntc_id', {
				templateUrl: 'views/home/editSchedule.html',
				controller: 'modifySchedule'
			})
			.when('/notice/:ntc_id', {
				templateUrl: 'views/home/notice.html',
				controller: 'notice'
			})
			.when('/applications', {
				templateUrl: 'views/home/applications.html',
				controller: 'applications'
			})
			.when('/applyfor', {
				templateUrl: 'views/home/applyfor.html',
				controller: 'applyfor'
			})
			.when('/acceptApp/:app_id', {
				templateUrl: 'views/home/acceptApp.html',
				controller: 'acceptApp'
			})
			.when('/modifyApp/:app_id', {
				templateUrl: 'views/home/modApp.html',
				controller: 'modifyApp'
			})
			.when('/login', {
				templateUrl: 'views/home/login.html',
				controller: 'login'
			})
			.when('/modifyPwd', {
				templateUrl: 'views/public/modifyPwd.html',
				controller: 'modifyPwd'
			})
	})
'use strict';
angular.module('homeApp.homeService', [])
	.factory('homeAPI', function(server) {
		return {
			"login": server + 'login',
			"submitNotice": server + 'add_notice',
			"submitSche": server + 'add_schedule',
			"fetchHomeInfo": server + 'get_notice_schedule',
			"clickDate": server + 'get_notice_schedule',
			"addApp": server + 'add_application',
			"fetchApps": server + 'get_application',
			"modifyApp": server + 'change_application',
			"acceptApp": server + 'change_application_status',
			"fetchNoticeById": server + 'get_notice',
			"modifyNotice": server + 'change_notice',
			"deleteNotice": server + 'delete_notice',
			"fetchScheById": server + 'get_schedule',
			"modifySche": server + 'change_schedule',
			"deleteSche": server + 'delete_schedule',
			"modifyPwd": server + 'reset_own_password'
		}	
	})


	.factory('clickDate', function(homeAPI) {
		return function(filter, callBack) {
			getData(homeAPI.clickDate, callBack, filter);
		}
	})
	.factory('addNoticeFormInit', function() {
		var myDate = new Date();
		var Y = myDate.getFullYear(),
			M = myDate.getMonth() + 1,
			D = myDate.getDate();
		return {
			"ntc_title": '',
			"ntc_sch": {
				"id": 1,
				"name" :'全部校区'
			},
			"ntc_start": {
				"year": Y,
				"month": M,
				"day": D
			},
			"ntc_end": {
				"year": Y,
				"month": M,
				"day": D
			},
			"ntc_content": ''
		}
	})
	.factory('addScheFormInit', function() {
		var myDate = new Date();
		var Y = myDate.getFullYear(),
			M = myDate.getMonth() + 1,
			D = myDate.getDate();
		return {
			"ntc_title": '',
			"ntc_sch": {
				"id": 1,
				"name" :'全部校区'
			},
			"ntc_start": {
				"year": Y,
				"month": M,
				"day": D
			},
			"ntc_end": {
				"year": Y,
				"month": M,
				"day": D
			}
		}
	})
	.factory('fetchNoticeById', function(homeAPI) {
		return function(ntc_id, callBack) {
			getData(homeAPI.fetchNoticeById, callBack, ntc_id);
		}
	})
	.factory('modifyNotice', function(homeAPI) {
		return function(data, callBack) {
			postData(homeAPI.modifyNotice, data, callBack);
		}
	})
	.factory('deleteNotice', function(homeAPI) {
		return function(data, callBack) {
			getData(homeAPI.deleteNotice, callBack, data);
		}
	})
	.factory('fetchScheById', function(homeAPI) {
		return function(data, callBack) {
			getData(homeAPI.fetchScheById, callBack, data);
		}
	})
	.factory('modifySche', function(homeAPI) {
		return function(data, callBack) {
			postData(homeAPI.modifySche, data, callBack);
		}
	})
	.factory('deleteSche', function(homeAPI) {
		return function(data, callBack) {
			getData(homeAPI.deleteSche, callBack, data);
		}
	})
	
	.factory('initHome', function($http) {
		var getHomeData = function() {
			return {
				//员工级别
				emp_level: '1',
				//下拉框需要
				schools: [{
					"id": '0',
					"name": '全部校区'
				}, {
					"id": '1',
					"name": '大学城校区'
				}, {
					"id": '2',
					"name": '华南校区'
				}],
				

			}
		}
	})
	.factory('fetchNtc', function($http, homeAPI) {
		var fetchNtc = function(ntc) {
			// return $http.get(homeAPI.fetchNtc, {
			// 	params: {
			// 		"ntc_id": '2'
			// 	}
			// }).success(function(data) {
			// 	return
			// }).error(function(data) {
			// 	return ''
			// });
			console.log(ntc);
			return {
				"ntc_title": '春节放假通知',
				"startDate": '2016-04-04',
				"endDate": '2016-04-16',
				"ntc_sch": '大学城校区',
				"ntc_content": ' #魅蓝手机3# 正式发布 599 元起，「颜值加速度」 2.5D 多彩聚碳酸酯，5 英寸八核全网通！25 日 16:00 魅族商城、专卖店、天猫旗舰店，苏宁易购等渠道开始预约，29 日魅族商城、天猫旗舰店，苏宁易购同步首发！专卖店及各零售卖场将陆续开售。 L参与预约，百台魅蓝3任性送#魅蓝手机3# 正式发布 599 元起，「颜值加速度」 2.5D 多彩聚碳酸酯，5 英寸八核全网通！',
				"emp_name": '罗晓彤',
				"ntc_time": '2014-04-02'
			}

		}
		
		return {
			fetchNtc: function(ntc) {
				return fetchNtc(ntc);
			}
		}
		
	})
	.factory('fetchApp', function($http, homeAPI) {
		var fetchApp = function(filter) {
			return [];
		}
	})
	.factory('initAppForm', function($http, homeAPI, $cookies) {
		var myDate = new Date();
		return {
			"user" :{
				"emp_id": $cookies.get('user_id'), //从cookie里面获得
				"date": getCurrentDate(),
				"emp_sch": $cookies.get('sch_name'),//cookie
				"emp_name": $cookies.get('user_name'),  //cookie
				"app_title": ''
			},
			"app": [{
				"app_content": '',
				"app_per": '',
				"app_num": ''
			}]
		}
	})
	.factory('fetchApplyById', function(homeAPI) {
		return function(filter, callBack) {
			getData(homeAPI.fetchApps, callBack, filter);
		}
	})

	.factory('login', function($http, homeAPI, $location) {
		return function(user, callBack) {
			//$location.path('/' + '123456');
			postData(homeAPI.login, user, callBack);
			// $.ajax({
			// 	url: homeAPI.login,
			// 	method: 'POST',
			// 	data: user,
			// 	dataType: 'json',
			// 	xhrFields: {
			// 		withCredentials: true
			// 	},
			// 	success: function(result) {
			// 		callBack(result);
			// 	}
			// })
		}
	})
	.factory('submitNotice', function(homeAPI) {
		return function(data, callBack) {
			postData(homeAPI.submitNotice, data, callBack);
		}
	})
	.factory('submitSche', function(homeAPI) {
		return function(data, callBack) {
			console.log(homeAPI)
			postData(homeAPI.submitSche, data, callBack);
		}
	})
	.factory('fetchHomeInfo', function(homeAPI) {
		return function(data, callBack) {
			getData(homeAPI.fetchHomeInfo, callBack, data);
		}
	})
	.factory('fetchHomeByYearM', function(homeAPI) {
		return function (filter, callBack) {
			getData(homeAPI.clickDate, callBack, filter);
		}
	})
	.factory('addApp', function(homeAPI) {
		return function(data, callBack) {
			postData(homeAPI.addApp, data, callBack);
		}
	})
	.factory('fetchApps', function(homeAPI) {
		return function(filter, callBack) {
			console.log(filter);
			getData(homeAPI.fetchApps, callBack, filter);
		}
	})
	.factory('modifyApp', function(homeAPI) {
		return function(data, callBack) {
			postData(homeAPI.modifyApp, data, callBack);
		}
	})


	//审核申请表
	.factory('acceptApp', function(homeAPI) {
		return function(data, callBack) {
			postData(homeAPI.acceptApp, data, callBack);
		}
	})

	//修改密码
	.factory('modifyPwd', function(homeAPI) {
		return function(data, callBack) {
			getData(homeAPI.modifyPwd, callBack, data);
		}
	})
'use strict';
angular.module('homeApp.home')
	// .controller('login', function($scope, $location, $cookies, login, fetchOptions, fetchPlanCouOp, birthAlert) {
	// 	$scope.user = {
	// 		"user_id": '',
	// 		"user_pwd": ''
	// 	}

	// 	$scope.login = function(valid) {
	// 		if(valid) {
	// 			login($scope.user, callBack);
	// 		}else{
	// 			alert('请完善登录信息');
	// 		}
			
	// 	}

	// 	var callBack = function(result) {
	// 		var status = result.status;
	// 		if(status == 1) {

	// 			// $cookies.put('authority', result.authority);
	// 			$cookies.put('user_name', result.user_name);
	// 			$cookies.put('sch_name', result.sch_name);
	// 			//$cookies.put('user_id', result.user_id);
	// 			// $cookies.put('sch_id', result.sch_id);
	// 			// $cookies.put('type', result.type);
	// 			// 将options存入本地存储
	// 			console.log($scope);
	// 			birthAlert('', function(result) {
	// 		      console.log(result);
	// 		      $scope.birthday = result.status;
	// 		      $scope.$apply();
	// 		    })
	// 			fetchOptions('', function(result) {
	// 				localStorage.setItem('options', JSON.stringify(result));
	// 				$location.path('' + $cookies.get('user_id'));
	// 			})

	// 			fetchPlanCouOp('', function(result) {
	// 				localStorage.setItem('courses', JSON.stringify(result));
	// 			})

	// 		}else{
	// 			alert('用户名或密码错误');
	// 		}
	// 	}
	// })
	.controller('modifyPwd', function($scope, $location, $cookies, modifyPwd) {
		$scope.postData = {
			"new_pwd":'',
			"re_pwd": '' 
		}
		$scope.modifyPwd = function(valid) {
			if(valid) {
				var post = $scope.postData;
				if(!post.new_pwd) {
					alert('密码不能为空');
					return false;
				}
				if(post.new_pwd !== post.re_pwd) {
					console.log($scope.postData)
					alert('两次密码不一致');
					return false;
				}
				var data = {
					new_pwd: $.md5($scope.postData.new_pwd),
					re_pwd: $.md5($scope.postData.re_pwd)
				}
				modifyPwd(data, function(result) {
					if(result.status == 1) {
						alert('成功修改密码');
						$scope.$apply(function() {
							$location.path('/' + $cookies.get('user_id'));
						})
					}
				})
			}
			
		}	
	})
'use strict';
angular.module('homeApp.home')
	.controller('applications', function($scope, $cookies, $location, fetchApps, pagination) {
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
			"num": num_per_page
		}
		
		var options = localStorage.getItem('options');

		options = JSON.parse(options);
		$scope.options = {
			schools: options.schools,
			"app_status": [{
				"id": '0',
				"name": '全部申请表'
			}, {
				"id": '1',
				"name": '已审核申请表'
			}, {
				"id": '2',
				"name": '待审核申请表'
			}]
		}
		
		

		//about pagination
		$scope.paginationConf = {};

		var getAllApps = function() {
			fetchApps($scope.filter, function(result) {
				console.log(result);
				$scope.applicate = result.result;
				//pagination
				var total = result.sum;
				$scope.paginationConf = pagination(total);
				$scope.paginationConf.onChange = function() {
					$scope.filter.page = $scope.paginationConf.currentPage;
					$scope.pageChange();
				}
				$scope.$apply();
			});
		}

		getAllApps();
		
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
			getAllApps();
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
	    			$scope.total.total_price = 0;
	    		}
	    		for(var i = 0, len = $scope.appForm.app.length; i < len; i ++) {
		    		$scope.total.total_price += $scope.appForm.app[i].app_per * $scope.appForm.app[i].app_num;
		    	}
	    	}
	    	

	    	$scope.submitApp = function() {
	    		console.log($scope.appForm);
				addApp($scope.appForm, function(result) {
	    			if(result.status == 1) {
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
    			callbackAlert(result.status, '修改成功');
    			window.location.href = ROOT + 'applications'
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
    		acceptApp($scope.postData, function(result) {
    			callbackAlert(result.status, '审批成功');
    			if(result.status == 1) {
    				window.location.href = ROOT + 'applications';
    			}
    		})
    	}

    	
    })
'use strict';
angular.module('homeApp.home')
	.controller('calendar', function($scope, $rootScope, $cookies, $location, $routeParams, clickDate, fetchHomeInfo, fetchHomeByYearM, deleteNotice, deleteSche) {
		
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
				}
			}
		}
		
		//init select options
		var options = localStorage.getItem('options');
		options = JSON.parse(options);
		$scope.options = {
			schools: options.schools,
			cur_date: moment().format('YYYY-MM-DD')
		}

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
			var ntc = {
				ntc_id: ntc_id
			}
			//执行删除日程的操作
			deleteSche(ntc, function(result) {
				if(result.status == 1) {
					alert('删除成功');
					$scope.$apply(function() {
						window.location.reload();
					})
				}else {
					alert('出现错误');
				}
			})
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

			var ntc = {
				ntc_id: ntc_id
			}

			deleteNotice(ntc, function(result) {
				if(result.status == 1) {
					alert('删除成功');
					$scope.$apply(function() {
						window.location.reload();
					})
				}else {
					alert('出现错误');
				}
			})

			
		}

		$scope.sendFilter = function() {
			$location.search({s_id: $scope.filter.selectSchool.id, s_na: $scope.filter.selectSchool.name});
		}	
	})
'use strict';
angular.module('homeApp.home')
	//查看公告详情
	.controller('notice',function($scope, $routeParams, fetchNoticeById) {
		fetchNoticeById($routeParams, function(result) {
			console.log(result)
			$scope.notice = result;
			$scope.$apply();
		})
	})
	.controller('addNotice', function($scope, $location, $cookies, addNoticeFormInit, submitNotice) {
		//init the form of add notice
		$scope.formData = addNoticeFormInit;

		//处理添加公告的权限问题
		var emp_type = {
			authority: $cookies.get('authority'),
			type: $cookies.get('type')
		}

		if(emp_type.type != 0 && emp_type.type != 1 && emp_type.type != 2) {
			alert('没有权限访问');
			$location.path('/' + $cookies.get('user_id'));
		}else if(emp_type.authority != 0 && emp_type.type != 1) {
			//只能添加自个儿校区的公告和日程
			$scope.formData.ntc_sch = {
				id: $cookies.get('sch_id'),
				name: $cookies.get('sch_name')
			}
		}else {
			//是CEO或者是财务
			//init select options
			var options = localStorage.getItem('options');
			options = JSON.parse(options);

			$scope.options = {
				schools: options.schools
			}
		}
		
		

		$scope.submitData = function(valid) {
			if(valid) {
				submitNotice($scope.formData, function(result) {
					callbackAlert(result.status, '添加成功');
					if (result.status) {
						window.location.href = ROOT + $cookies.get('user_id');
					};
				})
			}else{
				alert('fail valid')
			}
		}
	})
	.controller('modifyNotice', function($scope, $location, $cookies, $routeParams, fetchNoticeById, modifyNotice) {
		//处理添加公告的权限问题
		var emp_type = {
			authority: $cookies.get('authority'),
			type: $cookies.get('type')
		}

		if(emp_type.type != 0 && emp_type.type != 1 && emp_type.type != 2) {
			alert('没有权限访问');
			$location.path('/' + $cookies.get('user_id'));
		}else if(emp_type.authority != 0 && emp_type.type != 1) {
			//只能添加自个儿校区的公告和日程
			// $scope.formData.ntc_sch = {
			// 	id: $cookies.get('sch_id'),
			// 	name: $cookies.get('sch_name')
			// }
		}else {
			//是CEO或者是财务
			//init select options
			var options = localStorage.getItem('options');
			options = JSON.parse(options);

			$scope.options = {
				schools: options.schools
			}
		}
		
		fetchNoticeById($routeParams, function(result) {
			console.log(result);
			$scope.formData = result;
			$scope.$apply();
		});
		$scope.submitData = function() {
			$scope.formData.ntc_id = $routeParams.ntc_id;
			modifyNotice($scope.formData, function(result) {
				callbackAlert(result.status, '修改成功');
				if(result.status) {
					window.location.href = ROOT + $cookies.get('user_id');
				}
			})
		}
	})
	.controller('addSchedule', function($scope, $location, $cookies, addScheFormInit, submitSche) {
		// init the form og add schedule
		$scope.formData = addScheFormInit;

		//limit the right to modify the schedule
		var emp_type = {
			authority: $cookies.get('authority'),
			type: $cookies.get('type')
		}

		if(emp_type.type != 0 && emp_type.type != 1 && emp_type.type != 2) {
			alert('没有权限访问');
			$location.path('/' + $cookies.get('user_id'));
		}else if(emp_type.authority != 0 && emp_type.type != 1) {
			//只能添加自个儿校区的公告和日程
			$scope.formData.ntc_sch = {
				id: $cookies.get('sch_id'),
				name: $cookies.get('sch_name')
			}
		}else {
			//是CEO或者是财务
			//init select options
			var options = localStorage.getItem('options');
			options = JSON.parse(options);

			$scope.options = {
				schools: options.schools
			}
		}

		

		$scope.submitData = function() {
			console.log($scope.formData);
			if(checkInputInObj($scope.formData)) {
				console.log($scope.formData);
				//在这里启动提交数据的服务
				submitSche($scope.formData, function(result) {
					callbackAlert(result.status, '添加成功');
					if (result.status) {
						window.location.href = ROOT + $cookies.get('user_id');
					};
				})
			}
		}
	})
	.controller('modifySchedule', function($scope, $location, $cookies, $routeParams, fetchScheById, modifySche) {
		//limit the right to modify the schedule
		var emp_type = {
			authority: $cookies.get('authority'),
			type: $cookies.get('type')
		}

		if(emp_type.type != 0 && emp_type.type != 1 && emp_type.type != 2) {
			alert('没有权限访问');
			$location.path('/' + $cookies.get('user_id'));
			
		}else if(emp_type.authority != 0 && emp_type.type != 1) {
			//只能添加自个儿校区的公告和日程
			// $scope.formData.ntc_sch = {
			// 	id: $cookies.get('sch_id'),
			// 	name: $cookies.get('sch_name')
			// }
		}else {
			//是CEO或者是财务
			//init select options
			var options = localStorage.getItem('options');
			options = JSON.parse(options);

			$scope.options = {
				schools: options.schools
			}
		}

		fetchScheById($routeParams, function(result) {
			$scope.formData = result;
			$scope.$apply();
		});

		$scope.submitData = function() {
			$scope.formData.ntc_id = $routeParams.ntc_id;
			modifySche($scope.formData, function(result) {
				callbackAlert(result.status, '修改成功');
				if(result.status) {
					window.location.href = ROOT + $cookies.get('user_id');
				}
			})
		}
	})

