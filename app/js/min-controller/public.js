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
      for (var i = 5; i < 30; i++) {
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
	.filter('pay_or_not', function() {
		return function(input) {
			if(input == 0) {
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
	.filter('teacher_type', function() {
		return function(input) {
			if(!input) {
				return '全职老师'
			}else{
				return '兼职老师'
			}
		}
	})

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

