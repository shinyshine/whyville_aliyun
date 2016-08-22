//var ROOT = 'http://120.25.229.249:80/app/#/';
var ROOT =  'http://whyville.cn/app/#';
var API = 'http://120.25.229.249:8001/get_img';

var num_per_page = 12;
'use strict';

var app = angular.module('homeApp', ['ngRoute', 'ngCookies', 'tm.pagination', 'publicService', 'homeApp.home', 'homeApp.operating', 'homeApp.student', 'homeApp.educate', 'homeApp.finance', 'homeApp.analysis'])
  .config(function($routeProvider) {
        
  	$routeProvider
  	  .when('/:user_id', {
        templateUrl: 'views/home/calendar.html',
        controller: 'calendar'
      })
  })
  .controller('homeApp', function($scope, $cookies) {
    $scope.user = {
      "id": $cookies.get('user_id'),
      "user_name": $cookies.get('user_name'),
      /*"authority": $cookies.get('authority'),
      "sch_id": $cookies.get('sch_id'),
      "sch_name": $cookies.get('sch_name')*/
    }
    
    $scope.birthday = 0;
    $scope.$on('changeBirth', function(event, data) {
      $scope.birthday = data;
    })

    $scope.$on('putCookie', function(event, data) {
      $scope.user.id = data.user_id;  
      $scope.user.user_name = data.user_name;
    })
  })
  .controller('homeApp.header', function($location, $scope, $cookies, logOut) {
    $scope.underline = function(index) {
      $('#nav').children().removeClass('active-li');
      $('#nav').children().eq(index).addClass('active-li');
    }

    $scope.logOut = function() {
      logOut('', function(result) {
        $cookies.remove('authority');
        $cookies.remove('user_name');
        $cookies.remove('sch_name');
        $cookies.remove('user_id');
        $cookies.remove('sch_id');
        $cookies.remove('type');
        callbackAlert(result.status, '已退出登录');
        if(result.status == 1) {
          //$cookies.remove('user_id');
          $scope.$apply(function() {
            $location.path('/login');
            
          })
          // window.location.href = ROOT + 'login';
          setTimeout(function() {
            window.location.reload();
          }, 400)
          
        }
        
      })
      
    }

  })

  .controller('login', function($scope, $location, $cookies, login, fetchOptions, fetchPlanCouOp, birthAlert) {
    $scope.user = {
      "user_id": '',
      "user_pwd": ''
    }

    $scope.login = function(valid) {
      if(valid) {
        var pwd = $scope.user.user_pwd;
        var data = {
          user_id: $scope.user.user_id,
          user_pwd: $.md5(pwd)
        }
        login(data, callBack);
      }else{
        alert('请完善登录信息');
      }
      
    }

    var callBack = function(result) {
      var status = result.status;
      if(status == 1) {

        $cookies.put('authority', result.authority);
        $cookies.put('user_name', result.user_name);
        $cookies.put('sch_name', result.sch_name);
        $cookies.put('user_id', result.user_id);
        $cookies.put('sch_id', result.sch_id);
        $cookies.put('type', result.type);

        var data = {
          user_id: result.user_id,
          user_name: result.user_name
        }

        $scope.$emit('putCookie', data);
        // 将options存入本地存储

        birthAlert('', function(result) {
            console.log(result);
            $scope.$emit('changeBirth', result.status);
            $scope.$apply(function() {
              $location.path('/' + $cookies.get('user_id'));
            })
        })

        fetchOptions('', function(result) {
          localStorage.setItem('options', JSON.stringify(result));
          
          
        })

        fetchPlanCouOp('', function(result) {
          localStorage.setItem('courses', JSON.stringify(result));
        })

      }else{
        alert('用户名或密码错误');
      }
    }
  })
  

angular.module('homeApp')
  //select 没有id只有字符串的值

//年份 春季班
.directive('selectItem', function() {
      return {
        restrict: 'EA',
        scope: {
          selectOptions: '=selectOptions',
          item: '=whichItem',
          sendFilter: '&'
        },
        templateUrl: './views/public/select-item.html',
        link: function(scope, element, attrs) {
          scope.options = {
            'show': false,
          };

          scope.toggleOptions = function() {
            scope.options.show = !scope.options.show;
          }

          scope.clickOptions = function() {
            var name = this.item; 

            scope.options.show = false;
            scope.item.name = name;
            scope.sendFilter();
          }

        }
   }
})
.directive('selectNoId', function() {
      return {
        restrict: 'EA',
        scope: {
          selectOptions: '=selectOptions',
          item: '=whichItem',
          sendFilter: '&',
          
        },
        templateUrl: './views/public/select-item-2.html',
        link: function(scope, element, attrs) {
          scope.options = {
            'show': false,
          };

          scope.toggleOptions = function() {
            scope.options.show = !scope.options.show;

          }

          scope.clickOptions = function() {
            var name = this.item; 

            scope.options.show = false;
            scope.item = name;
            scope.sendFilter();
          }

        }
   }
})
  .controller('mySelect', function($scope) {
    $scope.options = {
      'show': false,
    };

    $scope.toggleOptions = function() {
      $scope.options.show = !$scope.options.show;
      $scope.downClick();
    }

    $scope.clickOptions = function() {
      var itemName = this.item.name,
        itemId = this.item.id;

      $scope.options.show = false;
      $scope.selected.name = itemName;
      $scope.selected.id = itemId;
      console.log($scope)

      $scope.sendFilter();
    }
  })

  .directive('teachAttend', function() {
      return {
        restrict: 'EA',
        scope: {
          selectOptions: '=selectOptions',
          selected: '=whichItem',
          sendFilter: '&',
          iconShow: '=iconShow'
        },
        template: '<div class="select-container"><div class="options">' +
        '<div class="content-wrap" ng-bind="selected.name | hasNotFinished"></div>' +
        '<ul class="options-ul" ng-show="options.show">' +
        '<li ng-repeat="item in selectOptions" ng-click="clickOptions()">{{item.name}}</li>' +
        '</ul>' +
        '</div>' +
        '<i class="click-show-btn down-btn-{{options.show}}" ng-show="iconShow" ng-init="options.show = false" ng-click="toggleOptions()"></i></div>',
          controller: 'mySelect',
        }
  })
  .directive('mySelect', function() {
    return {
      restrict: 'EA',
      scope: {
        selectOptions: '=selectOptions',
        selected: '=whichSchool',
        sendFilter: '&',
        downClick: '&'
      },
      template: '<div class="select-container"><div class="options">' +
        '<div class="content-wrap" ng-bind="selected.name | chooseForNone"></div>' +
        '<ul class="options-ul" ng-show="options.show">' +
        '<li ng-repeat="item in selectOptions" ng-click="clickOptions()">{{item.name}}</li>' +
        '</ul>' +
        '</div>' +
        '<i class="click-show-btn down-btn-{{options.show}}" ng-init="options.show = false" ng-click="toggleOptions()"></i></div>',
      controller: 'mySelect',
    }
  })

  .controller('radio', function($scope, $element) {
    $element.on('click', ' .radio-btn', function() {
      var val = $(this).data('code');
      $scope.radioVal = val;
      $scope.$apply();
      $(' .radio-btn', $element).removeClass('radio-true');
      $(this).addClass('radio-true');
    })
  })
  .directive('myRadio', function() {
    return {
      restrict: 'EA',
      scope: {
        radioVal: '=radioValue',
        options: '=options'
      },
      templateUrl: './views/public/radio.html',
      // link: function(scope, element) {
        
      // }
      controller: 'radio'
    }
  })
  .directive('mySelectAttend', function() {
    return {
      restrict: 'EA',
      scope: {
        selectOptions: '=selectOptions',
        selected: '=whichSchool',
        sendFilter: '&',
        iconShow: '=iconShow'
      },
      template: '<div class="select-container"><div class="options">' +
        '<div class="content-wrap" ng-bind="selected.name | chooseForNone"></div>' +
        '<ul class="options-ul" ng-show="options.show">' +
        '<li ng-repeat="item in selectOptions" ng-click="clickOptions()">{{item.name}}</li>' +
        '</ul>' +
        '</div>' +
        '<i class="click-show-btn down-btn-{{options.show}}" ng-show="iconShow" ng-init="options.show = false" ng-click="toggleOptions()"></i></div>',
      controller: 'mySelect',
    }
  })
  .directive('linkSelect', function() {
    return {
      restrict: 'EA',
      scope: {
        selectOptions: '=selectOptions',
        selectedOne:'=firstOne',
        selectedTwo:'=secondOne',
        sendFilter: '&'
      },
      template: '<div class="select-container link-select"><div class="options">' +
        '<div class="content-wrap" ng-bind="selectedOne.name | chooseForNone"></div>' +
        '<ul class="options-ul" ng-show="options.showFirst">' +
        '<li ng-repeat="item in selectOptions[0]" ng-click="clickFirstOptions($index)">{{item.name}}</li>' +
        '</ul>' +
        '</div>' +
        '<i class="click-show-btn down-btn-{{options.showFirst}}" ng-init="options.showFirst = false" ng-click="toggleFirst()"></i></div>'+
        '<i class="to-icon-select"></i>'+
        '<div class="select-container"><div class="options">' +
        '<div class="content-wrap" ng-bind="selectedTwo.name | chooseForNone"></div>' +
        '<ul class="options-ul" ng-show="options.showSecond">' +
        '<li ng-repeat="item in secondOptions" ng-click="clickSecondOptions()">{{item.name}}</li>' +
        '</ul>' +
        '</div>' +
        '<i class="click-show-btn down-btn-{{options.showSecond}}" ng-init="options.showSecond = false" ng-click="toggleSecond()"></i></div>',

      link: function(scope) {

        scope.toggleFirst = function() {
          scope.options.showFirst = !scope.options.showFirst;
        }
        scope.toggleSecond = function() {
          scope.options.showSecond = !scope.options.showSecond;
        }

        scope.clickFirstOptions = function(index) {
          var itemName = this.item.name,
            itemId = this.item.id;

          scope.selectedTwo = {
            "id": '',
            "name": ''
          }
          scope.secondOptions = scope.selectOptions[index+1];


          scope.options.showFirst = false;
          scope.selectedOne.name = itemName;
          scope.selectedOne.id = itemId;
          scope.sendFilter();
        }
        scope.clickSecondOptions = function() {
          var itemName = this.item.name,
            itemId = this.item.id;

          scope.options.showSecond = false;
          scope.selectedTwo.name = itemName;
          scope.selectedTwo.id = itemId;

          scope.sendFilter();
        }
      }
    }
  })
  

//左加右减的指令
.directive('myCount', function() {
  return {
    restrict: 'EA',
    scope: {
      timeNum: '=howMany'
    },
    template: '<i class="count-icon left-minus" ng-click="addTimes(-1)"></i>' +
      '<span class="times-wrap">{{timeNum}}</span>' +
      '<i class="count-icon right-add" ng-click="addTimes(1)"></i>',
    link: function(scope) {
      scope.addTimes = function(times) {
        if ((times == -1 && scope.timeNum > 0) || times == 1) {
          scope.timeNum = parseInt(scope.timeNum) + parseInt(times);
        }
      }
    }
  }
})

.directive('dateSelect', function() {
  return {
    restrict: 'EA',
    scope: {
      date: '=whichDate',
      sendFilter: '&'
    },
    templateUrl: './views/public/select-date.html',
    link: function(scope, element, attrs) {
      var myDate = new Date(),
        curYear = myDate.getFullYear(),
        years = [],
        days = [];

      //初始化多选框里面的年月日，有点不严谨，之后再说
      for (var i = 5; i < 60; i++) {
        years.push(curYear - i);
      }
      for (var i = 1; i <= 31; i++) {
        days.push(i);
      }

      scope.Year = years;
      scope.Month = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
      scope.Day = days;


      $(element).on('click', '.click-show-btn', function() {
        var optionsObj = $(this).siblings('.options').children('.options-ul');

        if ($(this).hasClass('down-btn-true')) {
          $(this).removeClass('down-btn-true');
          optionsObj.hide();
        } else {
          $(this).addClass('down-btn-true');
          optionsObj.show();
        }
      })

      $(element).on('click', '.options-ul li', function() {
        var type = $(this).data('type'),
          val = $(this).html();
        if (type == 'year') {
          scope.date.year = val;
        } else if (type == 'month') {
          scope.date.month = val;
        } else {
          scope.date.day = val;
        }
        scope.sendFilter();
        $(this).parent().siblings('.content-wrap').html(val);
        $('.options-ul', element).hide();
        $('.click-show-btn').removeClass('down-btn-true');
        scope.$apply();
        //console.log(scope.date);
      })

    }
  }
})

//性别单选按钮radio
.directive('chooseSex', function() {
  return {
    restrict: 'A',
    scope: {
      radioVal: '=radioValue',
      options: '=options'
    },
    template:'\
    <div>\
      <span><i class="radio-btn" ng-class="{&quot;radio-true&quot;: radioVal == 0}" data-code="0"></i>男</span>\
      <span><i class="radio-btn" ng-class="{&quot;radio-true&quot;: radioVal == 1}" data-code="1"></i>女</span></div>',


    link: function(scope, element) {
      element.on('click', ' .radio-btn', function() {
        var sexVal = $(this).data('code');
        scope.radioVal = sexVal;
        scope.$apply();
        $(' .radio-btn', element).removeClass('radio-true');
        $(this).addClass('radio-true');
      })
    }
  }
})

.directive('sidebar', function() {
  return {
    restrict: 'EA',
    scope: {
      itemName: '=',
      itemLink: '='
    },
    template: '<a href="javascript:void(0);">{{itemName}}</a>',
    link: function(scope, element) {
      element.on('click', function() {
        element.siblings().removeClass('active-tab');
        $(this).addClass('active-tab');
        $('html, body').animate({
          scrollTop: $(scope.itemLink).offset().top
      }, 500);
      })
    }
  }
})

  //valid time format 12:00 with valid-time
  .directive('validTime', [function () {
      return {
          require: "ngModel",
          link: function (scope, element, attr, ngModel) {
              var customValidator = function (value) {
                  var validity = ngModel.$isEmpty(value) || isTime(value);
                  ngModel.$setValidity("timeFormat", validity);
                  return validity ? value : undefined;
              };
              ngModel.$formatters.push(customValidator);
              ngModel.$parsers.push(customValidator);
          }
      };
  }])
'use strict';
angular.module('homeApp')
	.filter("chooseForNone", function() {
		return function(input) {
			if(!input) {
				return '未选择';
			}else{
				return input;
			}
		}
	})
	.filter("countAge", function() {
		return function(input) {
			var Y = new Date().getFullYear();
			return Y - input;
		} 
	})
	.filter("hasNotFinished", function() {
		return function(input) {
			if(!input) {
				return '未填写'
			}else{
				return input;
			}
		}
	})
	.filter('editing', function() {
		return function(input, status) {
			if(status) {
				return '完成';
			}else {
				return input;
			}
		}
	})

	.filter('busType', function() {
		return function(input) {
			if(input == '1') {
				return '接';
			}else {
				return '送';
			}
		}
	})
	.filter('checkEnter', function() {
		return function(input) {
			if(input == '1') {
				return '已录入'
			}else {
				return '未录入'
			}
		}
	})
	.filter('checkAttend', function() {
		return function(input) {
			if(input == 1) {
				return '已填写'
			}else {
				return '未填写'
			}
		}
	})
	.filter('sex', function() {
		return function(input) {
			if(input == '1') {
				return '女'
			}else {
				return '男'
			}
		}
	})
	.filter('feeOrNot', function() {
		return function(input) {
			if(input == '1') {
				return '已付款'
			}else {
				return '未付款'
			}
		}
	})

	.filter('yesOrNo', function() {
		return function(input) {
			if(!!input) {
				return '是';
			}else {
				return '否';
			}
		}
	})
	.filter('learningStatus', function() {
		return function(input) {
			var status = ['报名', '试听', '入学', '暂停', '退学'];
			return status[input-1];
		}
	})

	.filter('numberToWeek', function() {
		return function(input) {
			var week = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
			return week[input-1];
		}
	})
  .filter('pay_or_not2', function() {
    return function(input) {
      if(input <= 0) {
        return '未付款'
      }else{
        return input;
      }
    }
  })
	.filter('pay_or_not', function() {
		return function(input) {
			if(input <= 0) {
				return '未付款'
			}
		}
	})
	.filter('accept_or_not', function() {
		return function(input) {
			if(input == 1) {
				return '通过'
			}else{
				return '不通过'
			}
		}
	})
	// .filter('teacher_type', function() {
	// 	return function(input) {
	// 		if(!input) {
	// 			return '全职老师'
	// 		}else{
	// 			return '兼职老师'
	// 		}
	// 	}
	// })

	.filter('NaNtoO', function() {
		return function(input) {
			if(isNaN(input)) {
				return 0;
			}else{
				return input;
			}
		}
	})

	
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
			"fetchAllJobs": server + 'jobs',
			"uploadPhoto": server + 'upload_img',
			"fetchSchCourseType": server + 'get_schools_coursetype',
			"fetchOptions": server + 'common_data',
			"fetchCourseByStu": server + 'get_sch_by_stu',
			"getStuName": server + 'get_student_name',
			"logOut": server + 'logout',
			birthAlert: server + 'birthday_alert'
		}
	})

		// birthday alert
	.factory('birthAlert', function(API) {
		return function(data, callBack) {
			getData(API.birthAlert, callBack, data);
		}
	})

	//logout
	.factory('logOut', function(API) {
		return function(data, callBack) {
			getData(API.logOut, callBack, data);
		}
	})

	//get student's name by his id
	.factory('getStuName', function(API) {
		return function(data, callBack) {
			getData(API.getStuName, callBack, data);
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
		for(i = 1; i >=-10 ; i --) {
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

	.factory('pagination', function() {
		return function(totalPage) {
			return {
				currentPage: 1,
				totalItems: totalPage,
				itemsPerPage: num_per_page,
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
  .controller('teachAttend', function($scope, $routeParams, fetchPlanCouOp, fetchCourseRecord, modifyClassInfo) {

    var options = localStorage.getItem('options'),
      courses = localStorage.getItem('courses');

    options = JSON.parse(options);
    courses = JSON.parse(courses);

    $scope.options = {
      schools: options.schools,
      teachers: courses.teachers
    }

    $scope.attendType = [{
      "id": 0,
      "name": '缺勤'
    },{
      "id": 1,
      "name": '已到'
    }]

    fetchCourseRecord($routeParams, function(result) {
      console.log(result)
      $scope.courseInfo = result;
      $scope.$apply();
    })
    
    /*修改上课时间，老师，老师的出勤状态*/
    $scope.modify = function(index) {
      var status = $scope.courseInfo.courseList[index].isEditing;
      if(status) {
        var course = $scope.courseInfo.courseList[index];
        var date_time = course.course_date_time,
          dateArr = date_time.split(' '),
          date = dateArr[0],
          time = dateArr[1],
          timeArr = time.split('~'),
          time1 = timeArr[0],
          time2 = timeArr[1];
        if(isDate(date) && isTime(time1) && isTime(time2)) {
          var data = {
            "course_id": course.course_id,
            "course_date_time": course.course_date_time,
            "tea_id": course.course_teacher,
            "teacher_state": course.teacher_state
          }

          modifyClassInfo(data, function(result) {
            callbackAlert(result.status, '修改成功');
          })
        }else {
          alert('请按照正确的日期和时间格式');
        }
        
      }
      $scope.courseInfo.courseList[index].isEditing = !status;
    }
  })
  .controller('stuAttend', function($scope, $routeParams, fetchStuAttList, modifyStuAttend, allParticipated) {
    $scope.attendType = [{
      "id": 0,
      "name": '缺勤'
    },{
      "id": 1,
      "name": '已到'
    }]
    fetchStuAttList($routeParams, function(result) {
      $scope.$apply(function() {
        $scope.courseStuInfo = result;
      })
    })

    $scope.modify = function(index) {
      var item = $scope.courseStuInfo.stuInfo[index];
      if(item.isEditing) {
        //$http 
        //console.log('发送请求给后台，修改出勤状况');
        var postData = {
          "course_id": $routeParams.course_id,
          "stu_id": item.stu_id,
          "stu_state": item.stu_state
        }
        modifyStuAttend(postData, function(result) {
          if(result.status == 1) {
            alert('修改成功');
          }else {
            alert('操作失败。请稍后重试');
          }
        })

      }
      $scope.courseStuInfo.stuInfo[index].isEditing = !item.isEditing;
    }

    $scope.allParticipated = function() {
      allParticipated($routeParams, function(result) {
        if(result.status == 1) {
          window.location.reload();
        }
      })
    }
  })
  .controller('attendList', function($scope, $routeParams, fetchStuAttTable) {
    fetchStuAttTable($routeParams, function(result) {
      $scope.courseAttend = result;
      $scope.$apply();
    })
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
				"id": 0,
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
        if(result.status == 1) {
          window.location.reload();
        }
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
						window.location.href = ROOT + 'planCourse';
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
          if(result.status == 1) {
            window.location.href = ROOT + 'stuBusList';
          }
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
      "e_name": '',
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
			schools: options.schools
		}

		$scope.pageChange = function() {
			fecthStudents(function(result) {
				$scope.students = result.result;

				$scope.$apply();
			}, $scope.filter)	 
		}

		

    $scope.keyUpSearch = function(ev) {
      if (ev.keyCode !== 13) return; 

      $scope.sendFilter();
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

		$scope.pay = function(select_id, price, status, type) {
			if(status) {
				return false;
			}
			$location.path('/addIncome').search({s_id: select_id, co: price, stu: $routeParams.stu_id, type: type})
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
      console.log($scope.stuInfo);
      var data = $scope.stuInfo;
			if(data.stu_basic.publics.id != '' && data.learn_info.stu_sch.id != '' && data.learn_info.stu_learn_year != '' && data.learn_info.stu_learn_season != '') {
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

	.controller('modifyStuInfo', function($scope, $timeout, $location, $routeParams, fetchStuInfoById, getYearSessions, modifyStuInfo, previewimage) {
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
			$scope.stuInfo = result;
			var picPath = $scope.stuInfo.stu_basic.stu_pic;
      if(picPath != 'get_imgnull') {
        $scope.stuInfo.stu_basic.stu_pic = API + picPath;
      }else {
        $scope.stuInfo.stu_basic.stu_pic = '';
      }
			
			$scope.$apply();
		})

    //图片预览效果
    previewImage(function(ext_name) {
      $scope.stuInfo.stu_basic.stu_pic.ext_name = ext_name;
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

'use strict';
angular.module('homeApp.educate', ['ngRoute', 'homeApp.educateService'])
	.config(function($routeProvider) {
		$routeProvider
			.when('/eduCourseList', {
				templateUrl: 'views/educate/eduCourseList.html',
				controller: 'eduCourseList'
			})
			.when('/eduStuList/:course_id', {
				templateUrl: 'views/educate/eduStuList.html',
				controller: 'eduStuList'
			})
			.when('/todayClass/:course_id', {
				templateUrl: 'views/educate/todayClass.html',
				controller: 'todayClass'
			})
			.when('/stuAttendList/:course_id', {
				templateUrl: 'views/educate/stuAttendList.html',
				controller: 'stuAttendList'
			})
			.when('/teaStuAttend/:course_id', {
				templateUrl: 'views/educate/teaStuAttend.html',
				controller: 'teaStuAttend'
			})
			.when('/teaStuInfo/:stu_id', {
				templateUrl: 'views/educate/teaStuInfo.html',
				controller: 'teaStuInfo'
			})
			.when('/homework/:course_id', {
				templateUrl: 'views/educate/homework.html',
				controller: 'homework'
			})
			.when('/teaCallback/:course_id/:stu_id', {
				templateUrl: 'views/educate/callback.html',
				controller: 'teaCallback'
			})
			.when('/teaReport/:course_id/:stu_id', {
				templateUrl: 'views/educate/teaReport.html',
				controller: 'teaReport'
			})
	})

'use strict';
angular.module('homeApp.educate')
  .controller('stuAttendList', function($scope, $routeParams, fetchStuAttTable) {
    fetchStuAttTable($routeParams, function(result) {
      $scope.courseAttend = result;
      $scope.$apply();
    })
  })
  
  //教师修改学生的出勤状态
  .controller('teaStuAttend', function($scope, $routeParams, allAttend, fetchStuAttend, modifyStuAttend) {
    console.log($routeParams);
    $scope.attendType = [{
      "id": '0',
      "name": '缺勤'
    },{
      "id": '1',
      "name": '已到'
    }]

    
    fetchStuAttend($routeParams, function(result) {
      console.log(result);
      $scope.courseStuInfo = result;
      $scope.$apply();
    })

    $scope.modify = function(index) {
      var item = $scope.courseStuInfo.stuInfo[index];
      if(item.isEditing) {
        var postData = {
          "course_id": $routeParams.course_id,
          "stu_id": item.stu_id,
          "stu_state": item.stu_state
        }
        modifyStuAttend(postData, function(result) {
          callbackAlert(result.status, '修改成功');
        })
        
      }
      $scope.courseStuInfo.stuInfo[index].isEditing = !item.isEditing;
    }

    $scope.allAttend = function() {
      allAttend($routeParams, function(result) {
        if(result.status == 1) {
          alert('操作成功');
          window.location.reload();
        }
      })
    }
  })
  
  .controller('homework', function($scope, $routeParams, fetchHomeworks,modHomework) {
    fetchHomeworks($routeParams, function(result) {
      $scope.courseStuInfo = result;
      $scope.$apply();
    })

    $scope.modify = function(index) {
      var item = $scope.courseStuInfo.stuInfo[index],
        status = item.isEditing;
      if(status) {
        var postData = {
          "stu_id": item.stu_id,
          "att_id": item.course_id,
          "comment": item.homework_state
        }
        console.log(postData);
        modHomework(postData, function(result) {
          callbackAlert(result.status, '修改成功');
        }) 
      }
      $scope.courseStuInfo.stuInfo[index].isEditing = !status;  
    }
  })
'use strict';
angular.module('homeApp.educateService', [])
	.factory('eduAPI', function(server) {
		return {
			"fecthAllCourse": server + 'get_course',
			"fetchCourseStu": server + 'get_student',
			"fetchStuInfoById": server + 'get_student_information',
			"fetchTodayClass": server + 'get_course_information',
			"fetchHomeworks": server + 'get_student_homework_state',
			"fetchStuAttend": server + 'get_student_attendance',
			"modifyStuAttend": server + 'change_student_attendance',
			"allAttend": server + 'change_student_attendance',
			"fetchTeaCallBack": server + 'get_callback2',
			"postCallback": server + 'add_callback',
			"modifyCallback": server + 'change_callback2',
			"postClassRecord": server + 'change_course_record',
			"modHomework": server + 'change_student_homework_state'
		}
	})
	.factory('modHomework', function(eduAPI) {
		return function(data, callBack) {
			postData(eduAPI.modHomework, data, callBack);
		}
	})
	.factory('postClassRecord', function(eduAPI) {
		return function(data, callBack) {
			postData(eduAPI.postClassRecord, data, callBack);
		}
	})
	.factory('fetchTeaCallBack', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fetchTeaCallBack, callBack, data);
		}
	})

	.factory('postCallback', function(eduAPI) {
		return function(data, callBack) {
			postData(eduAPI.postCallback, data, callBack);
		}
	})

	.factory('teaModifyCallback', function(eduAPI) {
		return function(data, callBack) {
			postData(eduAPI.modifyCallback, data, callBack);
		}
	})
	.factory('fecthAllCourse', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fecthAllCourse, callBack, data);
		}
	})
	.factory('fetchCourseStu', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fetchCourseStu, callBack, data);
		}
	})
	.factory('fetchTodayClass', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fetchTodayClass, callBack, data);
		}

	})

	.factory('fetchStuInfoById', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fetchStuInfoById, callBack, data);
		}
	})

	.factory('fetchHomeworks', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fetchHomeworks, callBack, data);
		}
	})

	.factory('fetchStuAttend', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.fetchStuAttend, callBack, data);
		}
	})
	.factory('modifyStuAttend', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.modifyStuAttend, callBack, data);
		}
		
	})
	.factory('allAttend', function(eduAPI) {
		return function(data, callBack) {
			getData(eduAPI.allAttend, callBack, data);
		}
	})
	
'use strict';
angular.module('homeApp.educate')
	.controller('eduCourseList', function($scope, fecthAllCourse) {
		fecthAllCourse('', function(result) {
			$scope.$apply(function() {
				$scope.courseList = result;
			})
		})
	})
	.controller('eduStuList', function($scope, $routeParams, fetchCourseStu) {
		fetchCourseStu($routeParams, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})
	})
	.controller('todayClass', function($scope, $routeParams, fetchTodayClass, postClassRecord) {
		//$scope.data = fetchTodayClass($routeParams);

		fetchTodayClass($routeParams, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})
		$scope.modify = function(index) {
			var cur = $scope.data.classes[index],
				status = cur.isEditing;

			if(status) {
				var postData = {
					"course_id": cur.id, //排课编号,
					"att_id": cur.id,
					"note": cur.note
				}
				postClassRecord(postData, function(result) {
					if(result.status == 1) {
						alert('提交成功')
					}
				})
				console.log($scope.data.classes[index].note);
			}
			$scope.data.classes[index].isEditing = !status;
		}
	})

	.controller('teaCallback', function($scope, $routeParams, fetchTeaCallBack, postCallback, teaModifyCallback) {
		fetchTeaCallBack($routeParams, function(result) {
			$scope.callback = result;
			$scope.$apply();
		})

		$scope.postData = {
			"course_id": $routeParams.course_id,
			"stu_id": $routeParams.stu_id,
			"new_callback": ''
		}
		$scope.submitCallback = function() {
			postCallback($scope.postData, function(result) {
				callbackAlert(result.status, 'submit successfully');
			})
		}

		$scope.modify = function(index) {
			var data = $scope.callback.callbacks[index];
			data.course_id = $routeParams.course_id;
			data.stu_id = $routeParams.stu_id
			teaModifyCallback(data, function(result) {
				callbackAlert(result.status, 'modify successfully');
			})
		}
	})

	.controller('teaReport', function($scope, $routeParams, getReport, postReport, createChart, submitReport) {
		//hide the whole header, for the printing reasons
		$('#header').hide();
		
		getReport($routeParams, function(result) {
			$scope.data = result;
			createChart(result.chart_data.items, result.chart_data.score);
			$scope.$apply();
		})

		
		
		$scope.submitReport = function() {
			console.log($scope.data);
			$scope.data.stu_id = $routeParams.stu_id;
			$scope.data.course_id = $routeParams.course_id;
			submitReport($scope.data, function(result) {
				callbackAlert(result.status);
			})
		}
	})
'use strict';
angular.module('homeApp.educate')
	.controller('teaStuInfo', function($scope, $routeParams, fetchStuInfoById) {
		$scope.sidebar = [{
			"name": '基本信息',
			"link": '#basic',
			"default": 1
		},{
			"name": '家长信息',
			"link": '#parent'
		}]
		fetchStuInfoById($routeParams, function(result) {
			console.log(result);
			$scope.$apply(function() {
				$scope.stuInfo = result;
			})
		})
	})
'use strict';
 angular.module('homeApp.analysis', ['ngRoute', 'homeApp.analysisService'])
 	.config(function($routeProvider) {
 		$routeProvider
 			.when('/teaSalary', {
 				templateUrl: 'views/analysis/teaSalary.html',
 				controller: 'teaSalary'
 			})
 			//生源校区
 			.when('/schInfo', {
 				templateUrl: 'views/analysis/schInfo.html',
 				controller: 'schInfo'
 			})
 			.when('/stuFeeIncome/:course_id/:type_id', {
 				templateUrl: 'views/analysis/stuFeeIncome.html',
 				controller: 'stuFeeIncome'
 			})
 			.when('/schFeeIncome', {
 				templateUrl: 'views/analysis/schFeeIncome.html',
 				controller: 'schFeeIncome'
 			})
 			.when('/stuBookIncome/:course_id/:type_id', {
 				templateUrl: 'views/analysis/stuBookIncome.html',
 				controller: 'stuBookIncome'
 			})
 			.when('/schBookIncome', {
 				templateUrl: 'views/analysis/schBookIncome.html',
 				controller: 'schBookIncome'
 			})
 			.when('/stuBusIncome', {
 				templateUrl: 'views/analysis/stuBusIncome.html',
 				controller: 'stuBusIncome'
 			})
 			.when('/schBusIncome', {
 				templateUrl: 'views/analysis/schBusIncome.html',
 				controller: 'schBusIncome'
 			})
 	})

'use strict';
angular.module('homeApp.analysisService', [])
	.factory('analysisAPI', function(server) {
		return {
			"fetchTeaSalary": server + 'get_teacher_salary',
			"fetchStuFee": server + 'get_course_income',
			"fetchSchFee": server + 'get_course_income2',
			"fetchStuBookFee": server + 'get_book_income',
			"fetchSchBookFee": server + 'get_book_income2',
			"fetchStuBusFee": server + 'get_bus_income',
			"fetchSchBusFee": server + 'get_bus_income2',
			"fetchSchInfo": server + 'session_analysis'
		}
	})
	.factory('fetchTeaSalary', function(analysisAPI) {
		return function(data, callBack) {
			getData(analysisAPI.fetchTeaSalary, callBack, data);
		}
	})

	//获取具体课程收入列表
	.factory('fetchStuFee', function(analysisAPI) {
		return function(data, callBack) {
			getData(analysisAPI.fetchStuFee, callBack, data);
		} 
	})
	//获取整体课程收入列表
	.factory('fetchSchFee', function(analysisAPI) {
		return function(data, callBack) {
			getData(analysisAPI.fetchSchFee, callBack, data);
		}
	})
	
	//获取具体书费收入列表，以学生为主体
	.factory('fetchStuBookFee', function(analysisAPI) {
		return function(data, callBack) {
			getData(analysisAPI.fetchStuBookFee, callBack, data);
		}
	})
	.factory('fetchSchBookFee', function(analysisAPI) {
		
		return function(data, callBack) {
			getData(analysisAPI.fetchSchBookFee, callBack, data);
		}
	})
	.factory('fetchStuBusFee', function(analysisAPI) {
		
		return function(data, callBack) {
			getData(analysisAPI.fetchStuBusFee, callBack, data);
		} 
	})

	//获取校车收入列表，以校车为主体
	.factory('fetchSchBusFee', function(analysisAPI) {
		return function(data, callBack) {
			getData(analysisAPI.fetchSchBusFee, callBack, data);
		}
	})

	//获取校区生源信息
	.factory('fetchSchInfo', function(analysisAPI) {
		return function(data, callBack) {
			getData(analysisAPI.fetchSchInfo, callBack, data);
		}
	})
'use strict';
angular.module('homeApp.analysis')
	.controller('teaSalary', function($scope, fetchTeaSalary, getYearMonth) {
		$scope.filter = {
			"selectSchool": {
				"id": '1',
				"name": '全部校区'
			},
			"type": {
				"id": 0,
				"name": '全部教师'
			},
			"startTime": {
				"name": moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name": moment().add('+1', 'months').format('YYYY-MM')
			},
		}
		fetchTeaSalary($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			yearMonth: getYearMonth,
			type: [{
				"id": 1,
				"name": '全职老师'
			},{
				"id": 2,
				"name": '兼职老师'
			}]
		}
		
		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchTeaSalary($scope.filter, function(result) {
			$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('stuFeeIncome', function($scope, $location, $routeParams, fetchStuFee, getYearMonth, getYearSessions) {
		console.log($routeParams)
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"year": {
				"name": moment().format('YYYY')
			},
			"session": getCurSession(),
			"startTime": {
				"name": moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name": moment().add('+1', 'months').format('YYYY-MM')
			},
			"courseType": {
				"id": $routeParams.type_id,
				"name": $location.search().c_t
			},
			"course": {
				"id": $routeParams.course_id,
				"name": $location.search().c_n
			}
		}
		fetchStuFee($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYearSessions.year,
			session: getYearSessions.session,
			yearMonth: getYearMonth,
			courseType: options.linkCourse,
		}

		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchStuFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('schFeeIncome', function($scope, $location, fetchSchFee, getYearMonth, getYearSessions) {
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"year": {
				"name": moment().format('YYYY')
			},
			"session": getCurSession(),
			"startTime": {
				"name": moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name": moment().add('+1', 'months').format('YYYY-MM')
			},
			"courseType": {
				"id": '',
				"name": '课程类型'
			},
			"course": {
				"id": '',
				"name": ''
			}
		}
		fetchSchFee($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})
		
		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYearSessions.year,
			session: getYearSessions.session,
			yearMonth: getYearMonth,
			courseType: options.linkCourse,
		}

		$scope.skipToStuCourse = function(course_id, type_id, course_name, course_type) {
			$location.path('/stuFeeIncome/' + type_id + '/' + course_id).search({c_n: course_name, c_t: course_type});
		}

		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchSchFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('stuBookIncome', function($scope, $routeParams, $location, fetchStuBookFee, getYearMonth, getYearSessions) {
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"year": {
				"name": moment().format('YYYY')
			},
			"session": getCurSession(),
			"startTime": {
				"name":moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name":moment().add('+1', 'months').format('YYYY-MM')
			},
			"courseType": {
				"id": '',
				"name": '课程类型'
			},
			"courseType": {
				"id": $routeParams.type_id,
				"name": $location.search().c_t
			},
			"course": {
				"id": $routeParams.course_id,
				"name": $location.search().c_n
			}
		}
		fetchStuBookFee($scope.filter, function(result) {
			console.log(result)
			$scope.$apply(function() {
				$scope.data = result;
			})
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYearSessions.year,
			session: getYearSessions.session,
			yearMonth: getYearMonth,
			courseType: options.linkCourse,
		}

		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchStuBookFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('schBookIncome', function($scope, $location, fetchSchBookFee, getYearMonth, getYearSessions) {
		$scope.filter = {
			"selectSchool": {
				"id": 1,
				"name": '全部校区'
			},
			"year": {
				"name": moment().format('YYYY')
			},
			"session": getCurSession(),
			"startTime": {
				"name": moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name": moment().add('+1', 'months').format('YYYY-MM')
			},
			"courseType": {
				"id": '',
				"name": '课程类型'
			},
			"course": {
				"id": '',
				"name": ''
			}
		}
		fetchSchBookFee($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYearSessions.year,
			session: getYearSessions.session,
			yearMonth: getYearMonth,
			courseType: options.linkCourse,
		}

		$scope.sendFilter = function() {
			console.log($scope.filter);
			fetchSchBookFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}

		$scope.skipToStuBook = function(course_id, type_id, course_name, course_type) {
			$location.path('/stuBookIncome/' + type_id + '/' + course_id).search({c_n: course_name, c_t: course_type});

		}
	})

	.controller('stuBusIncome', function($scope, fetchStuBusFee, getYearSessions, getYearMonth, getYears) {
		$scope.filter = {
			"school": {
				"id": 1,
				"name": '全部校区'
			},
			"startTime": {
				"name": moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name": moment().add('+1', 'months').format('YYYY-MM')
			}, 
			"year": {
				"name": moment().format('YYYY')
			}, 
			"busNumber": {
				"id": 0,
				"name": '全部车牌'
			}
		}
		fetchStuBusFee($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYearSessions.year,
			yearMonth: getYearMonth,
			busNumber: options.bus_number
		}

		$scope.sendFilter = function() {
			fetchStuBusFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('schBusIncome', function($scope, fetchSchBusFee, getYearMonth, getYears) {
		$scope.filter = {
			"school": {
				"id": 1,
				"name": '全部校区'
			},
			"startTime": {
				"name": moment().add('-1', 'months').format('YYYY-MM')
			},
			"endTime": {
				"name": moment().add('+1', 'months').format('YYYY-MM')
			}, 
			"year": {
				"name": moment().format('YYYY')
			}, 
			"busNumber": {
				"id": 0,
				"name": '全部车牌'
			}
		}
		fetchSchBusFee($scope.filter, function(result) {
			$scope.$apply(function() {
				$scope.data = result;
			})
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYears,
			yearMonth: getYearMonth,
			busNumber: options.bus_number
		}

		$scope.sendFilter = function() {
			fetchSchBusFee($scope.filter, function(result) {
				$scope.$apply(function() {
					$scope.data = result;
				})
			})
		}
	})
	.controller('schInfo', function($scope, fetchSchInfo, getYearSessions) {
		$scope.filter = {
			"school": {
				"id": 1,
				"name": '全部校区'
			},
			"year": {
				"name": moment().format('YYYY')
			},
			"session": getCurSession()
		}
		fetchSchInfo($scope.filter, function(result) {
			$scope.data = result;
			$scope.$apply();
		})

		var options = getDataFromStorage('options');
		$scope.options = {
			schools: options.schools,
			year: getYearSessions.year,
			session: getYearSessions.sessions,
		}

		$scope.sendFilter = function() {
			fetchSchInfo($scope.filter, function(result) {
				console.log(result)
			})
		}
	})
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
	.controller('daily', function($scope, fetchDaily, getDate) {
		$scope.options = {
			date: getDate
		}

		$scope.filter = {
			date: {
				name: moment().format('YYYY-MM-DD')
			}
		}

		//show current day
		$scope.cur_time = {
			date: moment().format('YYYY-MM-DD')
		}
		fetchDaily('', function(result) {
			$scope.daily = result;
			$scope.$apply();
		})

		$scope.sendFilter = function() {
			fetchDaily($scope.filter, function(result) {
				$scope.daily = result;
				$scope.$apply();
			})
		}
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
			//fetchDailyByDate: server + '',
		}
	})

	//筛选财务日报
	// .factory('fetchDailyByDate', function(financeAPI) {
	// 	return function(data, callBack) {
	// 		getData(financeAPI.fetchDailyByDate, callBack, data);
	// 	}
	// })

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
		return function(price, s_id, stu, type) {
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
				"type": type,
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
				"name": moment().add('+1', 'months').format('YYYY-MM')
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
				"name": moment().add('+1', 'months').format('YYYY-MM')
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
        if(result.status == 1) {
          window.location.reload();
        }
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
		var options = getDataFromStorage('options');
    $scope.options = {
      schools: options.schools,
      bus_number: options.bus_number,
      course: options.course,
      pay_method: options.pay_method,
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


    var search = $location.search(),
			price = search.co,
			s_id = search.s_id,
			stu_id = search.stu,
      type = $scope.options.type[search.type - 1];

		$scope.formData = initAddIncomeForm(price, s_id, stu_id, type);

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
        if(result.status == 1) {
          if(!s_id && !stu_id) {
            window.location.href = ROOT + 'incomeList';
          }else {
            window.location.href = ROOT + 'stuInfo/' + stu_id;
          }
        }
        
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
				"name": moment().add('+1', 'months').format('YYYY-MM')
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