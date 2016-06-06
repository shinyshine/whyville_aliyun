'use strict';
angular.module('publicService', [])
	.factory('server', function() {
		//return 'http://139.129.45.236:8002/'
		return 'http://120.25.229.249:8001/'
	})

	.factory('injectOperating', function($q, $timeout) {
		return {
			inject: function() {
				console.log('inject');
				var defered = $q.defer(),
					loadScript = function() {
						$.getScript('./js/min-controller/operating.js', function() {
							defered.resolve();
						});

					}

				loadScript();
				return defered.promise;

			}
		}
	})
	.factory('API', function(server) {
		return {
			"fetchSchools": 'fetchSchools',
			"fetchAllJobs": server + 'jobs',
			"uploadPhoto": server + 'upload_img',
			"fetchSchCourseType": server + 'get_schools_coursetype',
			"fetchOptions": server + 'common_data',
			"fetchCourseByStu": server + 'get_sch_by_stu',
			"getStuName": server + '',
		}
	})

	//get student's name by his id
	.factory('getStuName', function(API) {
		return function(data, callBack) {
			//getData(API.getStuName, callBack, data);
			return {
				stu_name: 'luoxiaotong'
			}
		}
	})
	.factory('fetchCourseByStu', function(API) {
		return function(data, callBack) {
			getData(API.fetchCourseByStu, callBack, data);
		}
	})

	
	.factory('fetchOptions', function(API) {
		return function(data, callBack) {
			getData(API.fetchOptions, callBack, data);
		}
	})
	
	.factory('getWeekDays', function() {
		return [{
			"id": '1',
			"name": '星期一'
		},{
			"id": '2',
			"name": '星期二'
		},{
			"id": '3',
			"name": '星期三'
		},{
			"id": '4',
			"name": '星期四'
		},{
			"id": '5',
			"name": '星期五'
		},{
			"id": '6',
			"name": '星期六'
		},{
			"id": '7',
			"name": '星期日'
		}]
	})

	//返回一年之内的年份和月份作为下拉框的options
	.factory('getYearMonth', function() {
		var i, YM = [];
		for(i = 0; i >=-10 ; i --) {
			var item = moment().add(i, 'months').format('YYYY-MM');
			YM.push(item)
		}
		return YM;
	})
	.factory('previewImage', function($http) {
		return function(callBack) {
			
			$(".upload-btn input").on("change", function() {
				var _this = $(this);
				var val= $(this).val();
				var ext_name = val.substr(val.indexOf("."));
				
				var fr = new FileReader();
				fr.readAsDataURL(this.files[0]);

				var img = new Image();
				var btn = _this.parent();
				btn.hide();
				var upImg = btn.siblings(".upload-img");
				
				fr.onload = function() {
					img.src = this.result;
					img.onload = function() {
						btn.siblings(".upload-img").html(img);
					}
				}

				callBack(ext_name);

			});
		}
	})
	.factory('uploadPhoto', function(API) {
		return function(formObj, id, ext_name, callBack) {
			formObj.submit(function() {
				formObj.ajaxSubmit({
					type: "post",
					url: API.uploadPhoto,
					//dataType: 'json',
					data: {"id": id, "ext_name": ext_name},
					xhrFields: {
						withCredentials: true
					},
					success: function(result) {
						callBack(result);
					},
					// error: function(msg) {
					// 	alert("文件上传失败");
					// }
				});
				return false;
			});
			formObj.submit();
		}
	})
	//留着
	.factory('getYears', function() {
		var myDate = new Date(),
			curY = myDate.getFullYear(),
			year = [];

		for(var i = 0; i < 5; i ++) {
			year.push(curY-i);
		}
		return year;
	})
	//留着
	.factory('getYearSessions', function() {
		var myDate = new Date(),
			curY = myDate.getFullYear(),
			year = [];

		for(var i = -1; i < 5; i ++) {
			year.push(curY-i);
		}
		return {
			"year": year,
			"session": ['春季班', '夏季班', '秋季班', '冬季班'],
			"sessions": [{
				"id": 0,
				"name": '全部季度'
			},{
				"id": 1,
				"name": '春季班'
			},{
				"id": 2,
				"name": '夏季班'
			},{
				"id": 3,
				"name": '秋季班'
			},{
				"id": 4,
				"name": '冬季班'
			}],
		}
	})

	.factory('getDate', function() {
		var dateArr = [];

		for(var i = 0; i >=-10 ; i --) {
			var item = moment().add(i, 'day').format('YYYY-MM-DD');
			dateArr.push(item)
		}
		return dateArr;

	})

	//获得校区和校车选项
	.factory('fetchSchoolAndBus', function($http) {
		return function() {
			return {
				"schools": [{
					"id": 0,
					"name": '全部校区'
				}, {
					"id": 1,
					"name": '华南校区'
				}, {
					"id": 2,
					"name": '大学城校区'
				}],
				"bus": [{
					"id": 1,
					"name": '泰坦尼克号505'
				},{
					"id": 2,
					"name": '泰坦尼克号205'
				}]
			}
		}
	})
	.factory('pagination', function() {
		return function(totalPage) {
			return {
				currentPage: 1,
				totalItems: totalPage,
				itemsPerPage: 3,
				pagesLength: 15,
				perPageOptions: [10, 20, 30, 40, 50],
				//rememberPerPage: 'perPageItems',
			}
		}
	})

	.factory('fetchAllJobs', function(API) {
		return function(data, callBack) {
			getData(API.fetchAllJobs, callBack, data);
		}
	})

