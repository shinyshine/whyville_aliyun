'use strict';
angular.module('homeApp.operating', ['ngRoute', 'homeApp.operatingService'])
	.config(function($routeProvider) {
			$routeProvider
				.when('/employees', {
		  	  	    templateUrl: 'views/operating/employees.html',
		  	  	    controller: 'employees'
		  	    })
				.when('/addEmp/:emp_id', {
					templateUrl: 'views/operating/addEmp.html',
					controller: 'addEmp'
				})
				.when('/modifyEmp/:emp_id', {
					templateUrl: 'views/operating/modifyEmp.html',
					controller: 'modifyEmp'
				})
				.when('/empInfo/:emp_id', {
					templateUrl: 'views/operating/employeeInfo.html',
					controller: 'empInfo'
				})
				.when('/schoolManage', {
					templateUrl: 'views/operating/schoolManage.html',
					controller: 'SchoolManage'
				})
				.when('/addSchool', {
					templateUrl: 'views/operating/addSchool.html',
					controller: 'AddSchool'
				})
				.when('/modifySchool/:sch_id', {
					templateUrl: 'views/operating/modifySchool.html',
					controller: 'modifySchool'
				})
				.when('/emp_birth', {
					templateUrl: 'views/operating/emp_birthday.html',
					controller: 'empBirth'
				})
		})
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

	
/**
 * Created by luoxiaotong on 2016/4/19.
 */
'use strict';
angular.module('homeApp.operating')
  // cannot remove the service fetchOptions, to update localStorage
  .controller('addEmp', function($scope, $location, $routeParams, fetchOptions, initEmpForm, submitEmpInfo, previewImage) {

    var options = getDataFromStorage('options');
    $scope.options = {
      schools: options.schools,
      jobs: options.jobs
    }

    $scope.employeeInfo = initEmpForm($routeParams.emp_id);
    
   //图片预览效果
    previewImage(function(ext_name) {
      $scope.employeeInfo.emp_pic.ext_name = ext_name;
      $scope.$apply();
    })
    $scope.submitInfo = function(valid) {
      if(valid) {
        var postData = $scope.employeeInfo;
        if(postData.emp_sch.id && postData.emp_job.id) {
           submitEmpInfo(postData, function(result) {
              if(result.status == 1) {
                alert('添加成功');

                //update data in localstorage
                fetchOptions('', function(result1) {
                  localStorage.setItem('options', JSON.stringify(result1));
                })
                $scope.$apply(function() {
                  $location.path('/employees');
                })
                
              }else{
                alert('出现错误，稍后重试');
              }
            })
        }else{
          alert('请检查是否有必须项未填');
        }
      }
      
      
    }
  })
  .controller('modifyEmp', function($scope, $location, $routeParams, fetchEmpById, modifyEmp, modifyComment) {
    $scope.sidebar = [{
      "name": '基本信息',
      "link": '#basic',
      "default": 1
    },{
      "name": '员工评价',
      "link": '#comment'
    }]

    var options = getDataFromStorage('options');
    $scope.options = {
      schools: options.schools,
      jobs: options.jobs
    }

    fetchEmpById($routeParams, function(result) {
      console.log(result);
      $scope.employeeInfo = result;

      var picPath = API + result.info.emp_pic;
      $scope.employeeInfo.info.emp_pic = picPath;
      $scope.$apply();
    })

    $scope.modifyEmp = function() {
      console.log($scope.employeeInfo.info);
      modifyEmp($scope.employeeInfo.info, function(result) {
        callbackAlert(result.status, '修改成功');
        if(result.status == 1) {
          $scope.$apply(function() {
            $location.path('/employees');
          })
        }
      })
    }

    $scope.submitCom = function() {
      $scope.employeeInfo.comment.emp_id = $routeParams.emp_id
      modifyComment($scope.employeeInfo.comment, function(result) {
        callbackAlert(result.status, '修改成功');
        if(result.status == 1) {
          $scope.$apply(function() {
            $location.path('/employees');
          })
        }
      })
    }
  })
  .controller('empInfo', function($scope, $routeParams, fetchEmpById) {
    $scope.sidebar = [{
      "name": '基本信息',
      "link": '#basic',
      "default": 1
    },{
      "name": '员工评价',
      "link": '#comment'
    }]
    fetchEmpById($routeParams, function(result) {
      console.log(result)
      $scope.employeeInfo = result;

      var picPath = API + result.info.emp_pic;
      $scope.employeeInfo.info.emp_pic = picPath;
      $scope.$apply();
    })
  })


'use strict';

angular.module('homeApp.operating')
	.controller('employees', function($scope, $cookies, $location, employees, deleteEmp, resetPwd, createId, pagination) {
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"page": 1,
			"num": num_per_page,
			"authority": $cookies.get('authority')
		}

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools
		}

		//about pagination
		$scope.paginationConf = {};
		
		//employees是服务返回数据
		employees($scope.filter, function(result) {
			$scope.result = result.employees;

			//about pagination
			var total = result.sum;
			$scope.paginationConf = pagination(total);
			$scope.paginationConf.onChange = function() {
				$scope.filter.page = $scope.paginationConf.currentPage;
				$scope.pageChange();
			}
			$scope.$apply();
		});
		$scope.pageChange = function() {
			employees($scope.filter, function(result) {
				$scope.result = result.employees;
				$scope.$apply();
			});
		}

		//选择左上角校区筛选员工
		$scope.sendFilter = function() {
			$scope.filter.page = 1;
			employees($scope.filter, function(result) {
				console.log(result);
				$scope.result = result.employees;
				$scope.paginationConf.totalItems = result.sum;
				$scope.$apply();
			});

		}

		//删除员工  其实是离职
		$scope.deleteEmp = function(emp_id) {
			if (confirm('确认离职？')) {
				var emp = {
					emp_id: emp_id
				}
				deleteEmp(emp, function(result) {
					callbackAlert(result.status, '成功离职');
					if(result.status == 1) {
						window.location.reload();
					}
				})
			}
		}

		//重置密码
		$scope.resetPwd = function(emp_id) {
			if(confirm('确认重置密码？')) {
				var emp = {
					emp_id: emp_id
				}
				resetPwd(emp, function(result) {
					callbackAlert(result.status, '已重置密码');
					if(result.status == 1) {
						window.location.reload();
					}
				})
			}
			
		}

		$scope.addEmp = function() {
			createId('', function(result) {
				if(result.status) {
					console.log(result.emp_id);
					$scope.$apply(function() {
						$location.path('/addEmp/' + result.emp_id);
					})
					
				}
			})
		}
	})

	.controller('empBirth', function($scope, birthAlert) {
		birthAlert('', function(result) {
			if(result.status == 0) {
				alert('最近没有人生日');
			}else {
				$scope.birthList = result.list;
				$scope.$apply();
			}
			
		})
	})
'use strict'
angular.module('homeApp.operating')
	.controller('SchoolManage', function($scope, $cookies, fetchOptions, $location, fetchAllSchools) {
		$scope.emp_type = {
			authority: $cookies.get('authority')
		}
		fetchAllSchools('', function(result) {
			$scope.$apply(function() {
				$scope.result = result;
			})
		})

		$scope.addSchool = function() {
			if($scope.user.authority != 0) {
				alert('没有权限');
				return false;
			}else {
				//update data in localstorage
                fetchOptions('', function(result1) {
                  localStorage.setItem('options', JSON.stringify(result1));
                })
				$location.path('/addSchool');
			}
		}
		$scope.modifySchool = function(sch_id) {
			if($scope.user.authority != 0) {
				alert('没有权限');
				return false;
			}else {
				$location.path('/modifySchool/' + sch_id);
			}
		}
	})
	.controller('AddSchool', function($scope, addSchool) {
		$scope.formData = {
			"sch_name": '',
			"sch_ads": '',
			"sch_phone": ''
		}
		$scope.submitData = function() {
			addSchool($scope.formData, function(result) {
				window.location.href = ROOT + 'schoolManage';
			})
		}
	})
	.controller('modifySchool', function($scope, $routeParams, fetchSchById, modifySchInfo) {
		//$routeParams = {"sch_id": "1"};
		fetchSchById($routeParams, function(result) {
			$scope.schInfo = result.schInfo;
			$scope.$apply();
		});

		$scope.submitForm = function() {
			console.log($scope.schInfo);
			$scope.schInfo.sch_id = $routeParams.sch_id;
			modifySchInfo($scope.schInfo, function(result) {
				if (result.status == 1) {
					window.location.href = ROOT + 'schoolManage';
				}
			})
		}
	})