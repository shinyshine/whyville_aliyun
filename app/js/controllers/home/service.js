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
			"deleteNotice": server + 'deleteNotice',
			"fetchScheById": server + 'get_schedule',
			"modifySche": server + 'change_schedule',
			"deleteSche": server + 'deleteSche',
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