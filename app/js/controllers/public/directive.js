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