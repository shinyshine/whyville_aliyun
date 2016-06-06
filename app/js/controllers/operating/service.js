'use strict';
angular.module('homeApp.operatingService', [])
	.factory('operateAPI', function(server) {
		return {
			"employeeInfo": 'EmployeeInfo',
			"employees": server + 'employee_information',
			"deleteEmp": server + 'dismiss_employee',
			"resetPwd": server + 'reset_imployee_password',
			"createId": server + 'get_employee_new_id',
			"fetchInfoById": server + '',
			"fetchSchById": server + 'school',
			"submitEmpInfo": server + 'add_employee',
			"modifyComment":server + 'change_employee_other_information',
			"fetchAllSchools": server + 'school',
			"addSchool": server + 'add_school',
			"modifySchInfo": server + 'change_school_information',
			"fetchEmpById": server + 'change_employee_information'
		}
	})
	.factory('employees', function(operateAPI) {
		return function(filter, callBack) {
			getData(operateAPI.employees, callBack, filter);
		}
	})
	
	//删除员工的服务
	.factory('deleteEmp', function($http, operateAPI) {
		return function(data, callBack) {
			getData(operateAPI.deleteEmp, callBack, data);
		}

		return {
			deleteEmp: function(emp) {
				return deleteEmp(emp);
			}
		}
	})
	//重置密码服务
	.factory('resetPwd', function(operateAPI) {
		return function(data, callBack) {
			getData(operateAPI.resetPwd, callBack, data);
		}
	})
	//点击添加员工的时候发送请求到后台，生成员工编码并返回
	.factory('createId', function($http, operateAPI) {
		return function(data, callBack) {
			getData(operateAPI.createId, callBack);
		}
		// return {
		// 	"status": 1,
		// 	"emp_id": '2122'
		// }
	})
	//根据员工编号从后台获取员工数据，用来渲染表单的
	.factory('fetchInfoById', function(operateAPI) {
		return function(data, callBack) {
			getData(operateAPI.fetchInfoById, callBack, data);
		}
	})
	.factory('fetchSchById', function(operateAPI) {
		// {
		// 	"sch_name": '珠江新城校区',
		// 	"sch_ads": '珠江新城',
		// 	"sch_phone": '0206523635'
		// }
		return function(data, callBack) {
			getData(operateAPI.fetchSchById, callBack, data);
		}

		return {
			fetchSchById: function(sch) {
				return fetchSchById(sch);
			}
		}
	})
	.factory('submitEmpInfo', function($http, operateAPI) {
		return function(data, callBack) {
			$('#empForm').ajaxSubmit({
				type: "post",
				url: operateAPI.submitEmpInfo,
				dataType: 'json',
				data: data,
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function() {
					$('.mask').show();
				},
				success: function(result) {
					callBack(result);
				},
				complete: function() {
					$('.mask').hide()
				},
				error: function(msg) {
					alert("文件上传失败");
				}
			});
			//postData(operateAPI.submitEmpInfo, data, callBack);
		}
	})
	.factory('initEmpForm', function() {
		return function(emp_id) {
			return {
				"emp_id": emp_id,
				"emp_name": '',
				"emp_pic": {
					"ext_name": ''
				},
				"emp_birth": {
					"year": moment().format('YYYY'),
					"month": moment().format('MM'),
					"day": moment().format('DD')
				},
				"emp_sex": 0,
				"emp_card": '',
				"emp_tel": '',
				"emp_email": '',
				"emp_urgent": '',
				"emp_sch": {
					"id": '',
					"name": ''
				},
				"emp_job": {
					"id": '0',
					"name": '未选择'
				},
				"start_date": {
					"year": moment().format('YYYY'),
					"month": moment().format('MM'),
					"day": moment().format('DD')
				},
				// "end_date": {
				// 	"year": '',
				// 	"month": '',
				// 	"day": ''
				// },
				"emp_salary": '',
				"first_comment": '',
			}
		}
	})
	.factory('modifyComment', function(operateAPI) {
		return function(data, callBack) {
			postData(operateAPI.modifyComment, data, callBack);
		}
	})

	.factory('fetchAllSchools', function(operateAPI) {
		return function(data, callBack) {
			getData(operateAPI.fetchAllSchools,callBack, data);
		}
	})

	.factory('addSchool', function(operateAPI) {
		return function(data, callBack) {
			postData(operateAPI.addSchool, data, callBack);
		}
	})

	//修改校区信息
	.factory('modifySchInfo', function(operateAPI) {
		return function(data, callBack) {
			postData(operateAPI.modifySchInfo, data, callBack);
		}
	})
	.factory('fetchEmpById', function(operateAPI) {
		return function(data, callBack) {
			getData(operateAPI.fetchEmpById, callBack, data);
		}
	})

	.factory('modifyEmp', function(operateAPI) {
		return function(data, callBack) {
			postData(operateAPI.fetchEmpById, data, callBack);
		}
	})

	