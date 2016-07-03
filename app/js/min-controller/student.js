'use strict';
angular.module('homeApp.student', ['ngRoute', 'homeApp.studentService'])
	.config(function($routeProvider) {
		$routeProvider
			.when('/stuList', {
				templateUrl: 'views/student/stuList.html',
				controller: 'stuList'
			})
			.when('/stuInfo/:stu_id', {
				templateUrl: 'views/student/stuInfo.html',
				controller: 'stuInfo'
			})
			.when('/addStu/:stu_id', {
				templateUrl: 'views/student/addStuInfo.html',
				controller: 'addStu'
			})
			.when('/modifyStuInfo/:stu_id', {
				templateUrl: 'views/student/modifyStu.html',
				controller: 'modifyStuInfo'
			})
			.when('/courseList', {
				templateUrl: 'views/student/courseList.html',
				controller: 'courseList'
			})
			.when('/courseStuList/:course_id', {
				templateUrl: 'views/student/courseStuList.html',
				controller: 'courseStuList'
			})
			.when('/teachAttend/:course_id', {
				templateUrl: 'views/student/teachAttend.html',
				controller: 'teachAttend'
			})
			.when('/stuAttend/:course_id', {
				templateUrl: 'views/student/stuAttend.html',
				controller: 'stuAttend'
			})
			.when('/addCourse', {
				templateUrl: 'views/student/addCourse.html',
				controller: 'addCourse'
			})
			.when('/planCourse', {
				templateUrl: 'views/student/planCourse.html',
				controller: 'planCourse'
			})
			.when('/addStuToCourse/:course_id', {
				templateUrl: 'views/student/stuCourse.html',
				controller: 'addStuToCourse'
			})
			.when('/modStuCourse/:course_id/:stu_id', {//这里传的是排课编号。不是普通的课程编号也不是什么学生编号
				templateUrl: 'views/student/stuCourse.html',
				controller: 'modStuCourse'
			})
			.when('/callback/:course_id/:stu_id', {
				templateUrl: 'views/student/callback.html',
				controller: 'callback'
			})
			.when('/attendList/:course_id', {
				templateUrl: 'views/student/attendList.html',
				controller: 'attendList'
			})
			.when('/stuBusList', {
				templateUrl: 'views/student/stuBusList.html',
				controller: 'stuBusList'
			})
			.when('/addStuToBus', {
				templateUrl: 'views/student/addStuToBus.html',
				controller: 'addStuToBus'
			})
			.when('/busStuAttendList', {
				templateUrl: 'views/student/busStuAttendList.html',
				controller: 'busStuAttendList'
			})
			.when('/busStuAttend/:bus_id/:date', {
				templateUrl: 'views/student/busStuAttend.html',
				controller: 'busStuAttend'
			})
			.when('/report/:course_id/:stu_id', {
				templateUrl: 'views/student/report.html',
				controller: 'report'
			})
	})
'use strict';
angular.module('homeApp.studentService', [])
	.factory('stuAPI', function(server) {
		return {
			"fecthStudents": server + 'get_students',
			"createStuId": server + 'get_student_new_id',
			"submitStuInfo": server + 'add_student',
			"fetchStuInfoById": server + 'get_student_information',
			"modifyStuInfo": server + 'change_student_information',
			"fetchCourseList": server + 'get_courses',
			"postCourse": server + 'add_course',
			"fetchPlanCouOp": server + 'manager_course',  //新增接口
			"fetchStuOfTheCou": server + 'get_course_information2',
			"fetchCourseInfo": server + 'add_student_to_course',
			"addStuToCourse": server + 'add_student_to_course',
			"fetchStuAttList": server + 'get_course_attendance',
			"fetchCourseRecord": server + 'get_attendance',
			"modifyClassInfo": server + 'change_course_information',
			"modifyStuAttend": server + 'change_student_attendance',
			"allParticipated": server + 'change_student_attendance',
			"fetchStuAttTable": server + 'get_student_all_attendance',
			"fetchCallBack": server + 'get_callback',
			"modifyCallback": server + 'change_callback',
			"fetchStuBus": server + 'get_bus',
			"modBusStuAttend": server + 'change_student_bus_attendance',
			"addStuToBus": server + 'add_student_to_bus',
			"fetchBusRecord": server + 'get_bus_attendance',
			"fetchBusRecordById": server + 'get_bus_service_information',
			"postReport": server + 'get_report',
			"submitReport": server + 'change_report',
			"deleteCourse": server + 'delete_course2',
			"deleteStuInCourse": server + 'delete_course3',
			"deleteBus": server + 'delete_bus_service',
			
		}
	})
	//删除约车记录
	.factory('deleteBus', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.deleteBus, callBack, data);
		}
	})
	.factory('postReport', function(stuAPI) {
		return function(data, callBack) {
			postData(stuAPI.postReport, data, callBack);
		}
	})

	.factory('getReport', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.postReport, callBack, data);
		}
	})

	.factory('submitReport', function(stuAPI) {
		return function(data, callBack) {
			postData(stuAPI.submitReport, data, callBack);
		}
	})
	.factory('createChart', function() {
		return function(items, score) {
		    $('#chart').highcharts({
		        title: {
		            text: 'Chart',
		            x: -20 
		        },

		        xAxis: {
		            categories: items
		        },
		        yAxis: {
		            title: {
		                text: 'Score'
		            },
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        tooltip: {
		            valueSuffix: ''
		        },
		        legend: {
		            layout: 'vertical',
		            align: 'right',
		            verticalAlign: 'middle',
		            borderWidth: 0
		        },
		        series: [{
		            name: 'Entrance Score',
		            data: score.entrance
		        }, {
		            name: 'Midterm Score',
		            data: score.midterm
		        }, {
		            name: 'End Term Score',
		            data: score.endTerm
		        }]
		    });
		}
	})
	//获得所有学生列表
	.factory('fecthStudents', function(stuAPI) {
		return function(callBack, filter) {
			getData(stuAPI.fecthStudents, callBack, filter);
		}
	})
	//create 学生id
	.factory('createStuId', function(stuAPI) {
		return function(callBack) {
			getData(stuAPI.createStuId, callBack);
		}
	})

	//初始化学生 表单
	.factory('initStuForm', function() {
		var fetchData = function(stu_id) {
			return {
				"stu_basic": {
					"stu_zh_name": '',
					"stu_en_name": '',
					"stu_sex": '',
				    "stu_id": stu_id,
				    "stu_pic": {
				    	"ext_name": ''
				    },
					"stu_country": '',
					"stu_birth": {
						"year": moment().format('YYYY'),
						"month": moment().format('MM'),
						"day": moment().format('DD')
					},
					//"stu_age": '',
					"stu_ads": '',
					"stu_grade": '',
					"stu_study_sch": '', //就读学校
					"publics": {
						"id": '',
						"name": ''
					}, //宣传方式
					"study_exp": '', //学习经历
					"intersts": '', //兴趣爱好
					"character": '', //学生的性格
					"expectations": '', //学生学习期望
				},
				"stu_parent": {
					"par_name": '', //家长姓名
					//"par_relation": '未选择', //关系
					"par_tel": '', //联系方式
					"par_email": '',
					"par_character": '' //家长性格
				},
				"learn_info": {
					"stu_sch": {
						"id": '',
						"name": ''
					},
					"stu_learn_year": '',
					"stu_learn_season": '',
					"stu_learn_status": 1,
					// "courses": [{
					// 	"course_name": '',
					// 	"course_teacher": '',
					// 	"course_week_time": '', //星期
					// 	"course_time": '', //上课时间点
					// 	"course_remark": '' //备注
					// }]
				},
			// 	"school_bus": [{
			// 		"weekday": '',
			// 		"pick_time": '', //接时间
			// 		"pick_ads": '', //接送地点
			// 		"back_time": '', // 送时间
			// 		"times_per_week": '', //一周几次
			// 		"per_price": '', //金额
			// 		"sch_bus_remark": '' //备注
			// 	}],
			// 	"course_fee": [{
			// 		"course_name": '', //课程名称
			// 		"sum_count": '', //上课总次数
			// 		"per_price": '', //每次价格
			// 		"discount": '', //折扣
			// 		"cut": '', //减价
			// 		"fee_or_not": '', //是否付款学费
			// 		"book_fee": '',
			// 		"book_fee_or_not": '' //是否付款书费
			// 	}]
		    }

		}
		return {
			"fetchData": function(stu_id) {
				return fetchData(stu_id);
			}
		}
	})
	//根据stu_id获取学生相关信息
	.factory('fetchStuInfoById', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.fetchStuInfoById, callBack, data);
		}
		
	})

	//修改学生信息
	.factory('modifyStuInfo', function(stuAPI) {
		return function(data, callBack) {
			postData(stuAPI.modifyStuInfo, data, callBack);
		}
	})
	//获得课程列表
	.factory('fetchCourseList', function(stuAPI) {
		
		return function(filter, callBack) {
			getData(stuAPI.fetchCourseList, callBack, filter);
		}
	})

	//delete course
	.factory('deleteCourse', function(stuAPI){
		return function(data, callBack) {
			getData(stuAPI.deleteCourse, callBack, data);
		}
	})

	.factory('deleteStuInCourse', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.deleteStuInCourse, callBack, data);
		}
	})
	.factory('fetchPlanCouOp', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.fetchPlanCouOp, callBack, data);
		}
	})

	.factory('planCourse', function(stuAPI) {
		return function(data, callBack) {
			postData(stuAPI.fetchPlanCouOp, data, callBack);
		}
	})
	.factory('fetchStuInfoOfTheCourse', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.fetchStuOfTheCou, callBack, data);
		}
	})
	.factory('fetchStuBus', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.fetchStuBus, callBack, data);
		}
	})

	.factory('modBusStuAttend', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.modBusStuAttend, callBack, data);
		}
	})

	.factory('initAddToBusForm', function() {
		return {
			//"stu_name": '',
			"stu_id": '',
			"type": {
				"id": '',
				"name": ''
			},
			"weekdays": [{
				"choose": false,
				"weekday": 1,
				"time": ''
			},{
				"choose": false,
				"weekday": 2,
				"time": ''
			},{
				"choose": false,
				"weekday": 3,
				"time": ''
			},{
				"choose": false,
				"weekday": 4,
				"time": ''
			},{
				"choose": false,
				"weekday": 5,
				"time": ''
			},{
				"choose": false,
				"weekday": 6,
				"time": ''
			},{
				"choose": false,
				"weekday": 7,
				"time": ''
			}],
			"year": {
				"name": ''
			},
			"session": {
				"id": '',
				"name": ''
			},
			"discount_type": {
				"id": '',
				"name": ''
			},
			"bus_number": {
				"id": '',
				"name": ''
			},
			"place": '',
			//"time": '',
			"per_price": '',
			"sum_count": '',
			"discount": '',
			"pay_method": {
				"id": '',
				"name": ''
			},
			"pay_to": {
				"id": '',
				"name": ''
			}
		}
	})

	.factory('addStuToBus', function(stuAPI) {
		return function(data, callBack) {
			postData(stuAPI.addStuToBus, data, callBack);
		}
	})
	.factory('fetchBusRecord', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.fetchBusRecord, callBack, data);
		}
	})
	.factory('initAddToCourseForm', function() {
		return function(course_id) {
			return {
				"course_id": course_id,
				"stu_id": '',
				"sum_count": '', //课程总次数
				"per_price": '',  //每次课程的费用
				"discount_type": {
					"id": '',
					"name": ''
				},   //打折还是减价
				"discount": '',   //打折货减价的额度
				"fee_method": {
					"id": '',
					"name": ''
				},  //学费收费方式
				"fee_to": {
					"id": '',
					"name": ''
				},  //学费去处
				"book_fee_method": {
					"id": '',
					"name": ''
				},
				"book_fee_to": {
					"id": '',
					"name": ''
				},
				"book_fee": '',
				"remark": ''
			}
		}
		
	})
	.factory('fetchCourseInfo', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.fetchCourseInfo, callBack, data);
		}
	})
	.factory('addStuToCourse', function(stuAPI) {
		return function(data, callBack) {
			postData(stuAPI.addStuToCourse, data, callBack);
		}
	})
	.factory('fetchCourseRecord', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.fetchCourseRecord, callBack, data);
		}
	})
	.factory('modifyClassInfo', function(stuAPI) {
		return function(data, callBack) {
			postData(stuAPI.modifyClassInfo, data, callBack);
		}
	})
	.factory('fetchStuAttList', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.fetchStuAttList, callBack, data);
		}
	})

	//修改学生的出勤状态
	.factory('modifyStuAttend', function(stuAPI) {
		return function(data, callBack) {
			postData(stuAPI.modifyStuAttend, data, callBack);
		}
	})

	//全勤
	.factory('allParticipated', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.allParticipated, callBack, data);
		}
	})

	//获取所有学生在该门课程中的考勤；列表
	.factory('fetchStuAttTable', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.fetchStuAttTable, callBack, data);
		}
	})
	.factory('fetchBusRecordById', function(stuAPI) {
		return function(data, callBack) {
			getData(stuAPI.fetchBusRecordById, callBack, data);
		}
	})

	.factory('submitStuInfo', function(stuAPI) {
		return function(data, callBack) {
			$('#stuForm').ajaxSubmit({
				type: "post",
				url: stuAPI.submitStuInfo,
				dataType: 'json',
				// data: {"id": id, "ext_name": ext_name},
				data: data,
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function() {
					$('.mask').show()
				},
				success: function(result) {
					callBack(result);
				},
				complete: function() {
					$('.mask').hide();
				},
				error: function(msg) {
					alert("文件上传失败");
				}
			});

			//postData(stuAPI.submitStuInfo, data, callBack);
		}
	})


	.factory('postCourse', function(stuAPI) {
		return function(data, callBack) {
			postData(stuAPI.postCourse, data, callBack);
		}
	})
	//callback
	.factory('fetchCallBack', function(stuAPI) {

		return function(data, callBack) {
			getData(stuAPI.fetchCallBack, callBack, data);
		}
	})

	.factory('modifyCallback', function(stuAPI) {
		return function(data, callBack) {
			postData(stuAPI.modifyCallback, data, callBack);
		}
	})

	.factory('initPlanForm', function() {
		return {
			"course_year": '',
			"course_session": '',
			"course_name": {
				"id": '',
				"name": ''
			},
			"course_teacher": {
				"id": '',
				"name": ''
			},
			"weekdays": [{
				"choose": false,
				"weekday": 1,
				"start_time": '',
				"end_time": ''
			},{
				"choose": false,
				"weekday": 2,
				"start_time": '',
				"end_time": ''
			},{
				"choose": false,
				"weekday": 3,
				"start_time": '',
				"end_time": ''
			},{
				"choose": false,
				"weekday": 4,
				"start_time": '',
				"end_time": ''
			},{
				"choose": false,
				"weekday": 5,
				"start_time": '',
				"end_time": ''
			},{
				"choose": false,
				"weekday": 6,
				"start_time": '',
				"end_time": ''
			},{
				"choose": false,
				"weekday": 7,
				"start_time": '',
				"end_time": ''
			}],
			"sum_count": '',
			"per_price": '',
			"book_fee": ''
		}
	})


'use strict';
angular.module('homeApp.student')
	.controller('courseList', function($scope, deleteCourse, getYearSessions, fetchCourseList) {
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"selectSession": {
				"id": 0,
				"name": '全部季度'
			},
			"selectYear": {
				"name": '2016'
			},
			"courseType": {
				"id": 1,
				"name": '所有课程类型'
			},
			"search": '',
		}

		var options = localStorage.getItem('options');
		options = JSON.parse(options);

		$scope.options = {
			schools: options.schools,
			years: getYearSessions.year,
			sessions: getYearSessions.sessions,
			courseType: options.courseType
		}
	
		//初始化课程列
		fetchCourseList($scope.filter, function(result) {
			console.log(result);
			$scope.courses = result;
			$scope.$apply();
		});

		$scope.sendFilter = function() {
			fetchCourseList($scope.filter, function(result) {
				console.log(result);
				$scope.courses = result;
				$scope.$apply();
			});
		}

		//delete course
		$scope.deleteCourse = function(course_id) {
			var data = {
				course_id: course_id
			}
			deleteCourse(data, function(result) {
				callbackAlert(result.status, '成功删除一门课程');
				window.location.reload();
			})
		}
	})
	.controller('courseStuList', function($scope, $routeParams, deleteStuInCourse, fetchStuInfoOfTheCourse) {
		fetchStuInfoOfTheCourse($routeParams, function(result) {
			console.log(result);
			$scope.stuCourse = result;
			$scope.$apply();
		})

		$scope.deleteStu = function(stu_id) {
			var data = {
				course_id: $routeParams.course_id,
				stu_id: stu_id
			}
			deleteStuInCourse(data, function(result) {
				callbackAlert(result.status, '成功删除一门课程');
			})
		}
	})
	.controller('addCourse', function($scope, fetchPlanCouOp, postCourse) {
		var options = localStorage.getItem('options');
		options = JSON.parse(options);

		$scope.options = {
			schools: options.schools,
			courseType: options.courseType
		}
		//初始化表单
		$scope.course = {
			"school": {
				"id": '',
				"name": ''
			},
			"courseType": {
				"id": '',
				"name": ''
			},
			"courseName": ''
		}

		$scope.addCourse = function() {
			if($scope.course.school.id && $scope.course.courseType.id &&$scope.course.courseName) {
				postCourse($scope.course, function(result) {
					callbackAlert(result.status, '添加成功');
					if(result.status == 1) {
						window.location.href = ROOT + 'courseList';
					}

					//update data in localstorage
					fetchPlanCouOp('', function(result) {
						localStorage.setItem('courses', JSON.stringify(result));
					})
				})
			}
		}
	})
	.controller('planCourse', function($scope, fetchPlanCouOp, initPlanForm, getYearSessions, getWeekDays, planCourse) {
		var courses = localStorage.getItem('courses');
		courses = JSON.parse(courses);
		$scope.options = {
			teachers: courses.teachers,
			courses: courses.courses,
			years: getYearSessions.year,
			sessions: getYearSessions.session,
			weekdays: getWeekDays
		}

		$scope.course = initPlanForm;

		$scope.submitCourseInfo = function() {
			var cou = $scope.course;
			if(cou.course_year && cou.course_session && cou.course_name.id && cou.course_teacher.id) {
				
				//filter time format
				var week = cou.weekdays;

				for(var item in week) {
					var cur = week[item];
					if(cur.choose) {
						//console.log(week[item]);
						if(!isTime(cur.start_time) || !isTime(cur.end_time)) {
							alert('请使用正确的时间格式, 12:00');
							return false;
						}
					}
				}
				planCourse($scope.course, function(result) {
					callbackAlert(result.status, '成功排课');
					if(result.status == 1) {
						window.location.href = ROOT + 'courseList';
					}
				})
			}else {
				alert('请完成必要信息的额填写');
			}
		}
	})
	.controller('addStuToCourse', function($scope, $routeParams, initAddToCourseForm, fetchCourseInfo, addStuToCourse, getStuName) {
		fetchCourseInfo($routeParams, function(result) {
			console.log(result);
			$scope.courseInfo = result;
			$scope.$apply();
		})

		
		$scope.formData = initAddToCourseForm($routeParams.course_id);

		$scope.options = {
			"discount": [{
				"id": 0,
				"name": '打折'
			},{
				"id": 1,
				"name": '减价'
			}]
		}

		var options = localStorage.getItem('options');
		options = JSON.parse(options);
		$scope.options.pay_method = options.pay_method;


		//get student's name by his id
		$scope.getStuName = function() {
			var stuId = {
				stu_id: $scope.formData.stu_id
			}

			//$scope.formData.stu_name = getStuName().stu_name;
			getStuName(stuId, function(result) {
				console.log(result);
				$scope.formData.stu_name = result.stu_name;
				$scope.$apply();
			})
		}
		

		$scope.submitData = function() {
			addStuToCourse($scope.formData, function(result) {
				callbackAlert(result.status, '添加成功');
				if(result.status == 1) {
					window.location.href = ROOT + 'courseStuList/' + $routeParams.course_id;
				}
			})
		}
	})
	.controller('callback', function($scope, $routeParams, fetchCallBack, modifyCallback) {
		fetchCallBack($routeParams, function(result) {
			$scope.callback = result;
			$scope.$apply();
		})
		
		$scope.submitCallback = function(index) {
			var postData = $scope.callback.callbacks[index];
			postData.course_id = $routeParams.course_id;
			postData.stu_id = $routeParams.stu_id;
			console.log(postData);
			modifyCallback(postData, function(result) {
				callbackAlert(result.status);
			})
		}
	})
	.controller('report', function($scope, $routeParams, getReport, postReport, createChart, submitReport) {
		//hide the whole header, for the printing reasons
		$('#header').hide();
		
		getReport($routeParams, function(result) {
			console.log(result);
			$scope.data = result;
			createChart(result.chart_data.items, result.chart_data.score);
			$scope.$apply();
		})

		
		
		$scope.submitReport = function() {
			console.log($scope.data);
			$scope.data.stu_id = $routeParams.stu_id;
			$scope.data.course_id = $routeParams.course_id;
			submitReport($scope.data, function(result) {
				if(result.status == 1) {
					alert('操作成功');
				}else{
					alert('请完善信息');
				}
			})
		}
	})
'use strict';
angular.module('homeApp.student')
	.controller('stuBusList', function($scope, getYearSessions, fetchStuBus, deleteBus) {
		$scope.filter = {
			"selectSchool": {
				"id": '1',
				"name": '全部校区'
			},
			"selectBus": {
				"id": '0',
				"name": '全部车牌'
			},
			"type": {
				"id": '1',
				"name": '接'
			},
			"selectSession": {
				"id": 0,
				"name": '全部季度'
			},
			"selectYear": {
				"name": '2016'
			},
		}

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			bus_number: options.bus_number,
			type: [{
				"id": '0',
				"name": '送'
			}, {
				"id": '1',
				"name": '接'
			}],
			years: getYearSessions.year,
			sessions: getYearSessions.session
		}
		fetchStuBus($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.stuBus = result;
			})
		})


		$scope.sendFilter = function() {
			fetchStuBus($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.stuBus = result;
				})
			})
		}

		$scope.deleteBus = function(ser_id) {
			var data = {
				ser_id: ser_id
			}
			deleteBus(data, function(result) {
				callbackAlert(result.status, '删除成功');
			})
		}
	})
	.controller('addStuToBus', function($scope, $location, addStuToBus, getYearSessions, getStuName, getWeekDays, initAddToBusForm) {

		var options = getDataFromStorage('options');
		$scope.options = {
			type: [{
				"id": '0',
				"name": '送'
			}, {
				"id": '1',
				"name": '接'
			}],
			years: getYearSessions.year,
			sessions: getYearSessions.session,
			bus_number: options.bus_number,
			discount: [{
				"id": 0,
				"name": '打折'
			},{
				"id": 1,
				"name": '减价'
			}],
			pay_method: options.pay_method,
			weekdays: getWeekDays
		}

		//init form data, almost empty value
		$scope.formData = initAddToBusForm;

		//get student's name by his id
		$scope.getStuName = function() {
			var stuId = {
				stu_id: $scope.formData.stu_id
			}

			//$scope.formData.stu_name = getStuName().stu_name;
			getStuName(stuId, function(result) {
				$scope.formData.stu_name = result.stu_name;
				$scope.$apply();
			})
		}


		$scope.submitData = function() {
			var data = $scope.formData;
			if(data.bus_number.name && data.type.name && data.discount_type.name && data.session.name && data.year.name) {
				
				//filter time format
				var week = data.weekdays;

				for(var item in week) {
					var cur = week[item];
					if(cur.choose) {
						//console.log(week[item]);
						if(!isTime(cur.time)) {
							alert('请使用正确的时间格式, 12:00');
							return false;
						}
					}
				}

				addStuToBus($scope.formData, function(result) {
					callbackAlert(result.status);
					$location.path('/stuBusList');
				})
			}else{
				alert('请完善信息');
			}	
		}
	})

	.controller('busStuAttendList', function($scope, getYears, fetchBusRecord) {
		$scope.filter = {
			"selectBus": {
				"id": '0',
				"name": '全部车牌'
			},
			"date": {
				"year": moment().format('YYYY'),
				"month": moment().format('MM'),
				"day": moment().format('DD')
			}
		}

		var options = getDataFromStorage('options');
		$scope.options = {
			bus_number: options.bus_number,
			years: getYears
		}

		fetchBusRecord($scope.filter, function(result) {
			$scope.data = result;
			$scope.$apply();
		})

		$scope.sendFilter = function() {
			fetchBusRecord($scope.filter, function(result) {
				$scope.data = result;
				$scope.$apply();
			})
		}
	})
	.controller('busStuAttend', function($scope, $routeParams, fetchBusRecordById, modBusStuAttend) {
		$scope.attendType = [{
			"id": '1',
			"name": '是'
		},{
			"id": '0',
			"name": '否'
		}]
		$scope.filter = {
			"bus": {
				"id": $routeParams.bus_id
			},
			"date": $routeParams.date,
			"type": {
				"id": -1,
				"name": '接或送'
			}
		}
		$scope.options = {
			type: [{
				"id": -1,
				"name": '接或送'
			},{
				"id": '0',
				"name": '送'
			},{
				"id": '1',
				"name": '接'
			}]
		}

		//$scope.data = fetchBusRecordById($routeParams);
		fetchBusRecordById($scope.filter, function(result) {
			$scope.busAttend = result;
			$scope.$apply();
		})

		$scope.modify = function(index) {
			var cur = $scope.busAttend.list[index],
				status = cur.isEditing;

			if(status) {
				var data = {
					"ser_id": {
						"id": cur.ser_id
					},
					"state": cur.attend_state
				}
				modBusStuAttend(data, function(result) {
					callbackAlert(result.status, '考勤成功');
				})
			}
			$scope.busAttend.list[index].isEditing = !status;
		}

		$scope.sendFilter = function() {
			fetchBusRecordById($scope.filter, function(result) {
				$scope.busAttend = result;
				$scope.$apply();
			})
		}
	})
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
