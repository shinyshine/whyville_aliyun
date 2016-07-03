'use strict';
//var ROOT = 'http://10.173.125.162:8000/app/#/';
var ROOT = 'http://120.25.229.249:8000/app/#/';   //some problems here

var app = angular.module('homeApp', ['ngRoute', 'ngCookies', 'tm.pagination', 'publicService', 'homeApp.home', 'homeApp.operating', 'homeApp.student', 'homeApp.educate', 'homeApp.finance', 'homeApp.analysis'])
  .config(function($routeProvider) {
        
  	$routeProvider
      // .when('/employees', {
      //     templateUrl: 'views/operating/employees.html',
      //     controller: 'employees',
      //     resolve: {
      //       operate: function(injectOperating) {
      //         return injectOperating.inject();
      //       }
      //     }
      // })
  	  .when('/:user_id', {
        templateUrl: 'views/home/calendar.html',
        controller: 'calendar'
      })

      // use the HTML5 History API  
      //$locationProvider.html5Mode(true);
  })
  .controller('homeApp', function($scope, $cookies) {
    $scope.user = {
      "id": $cookies.get('user_id'),
      "user_name": $cookies.get('user_name'),
      "authority": $cookies.get('authority'),
      "sch_id": $cookies.get('sch_id'),
      "sch_name": $cookies.get('sch_name')
    }
    
    $scope.birthday = 0;
    $scope.$on('changeBirth', function(data) {
      $scope.birthday = data;
    })
  })
  .controller('homeApp.header', function($scope, $cookies, logOut) {
    $scope.underline = function(index) {
      $('#nav').children().removeClass('active-li');
      $('#nav').children().eq(index).addClass('active-li');
    }

    $scope.logOut = function() {
      logOut('', function(result) {
        
        callbackAlert(result.status, '已退出登录');
        if(result.status == 1) {
          //$cookies.remove('user_id');
          window.location.href = ROOT + 'login';
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
        console.log(data);
        login(data, callBack);
      }else{
        alert('请完善登录信息');
      }
      
    }

    var callBack = function(result) {
      var status = result.status;
      if(status == 1) {

        // $cookies.put('authority', result.authority);
        $cookies.put('user_name', result.user_name);
        $cookies.put('sch_name', result.sch_name);
        //$cookies.put('user_id', result.user_id);
        // $cookies.put('sch_id', result.sch_id);
        // $cookies.put('type', result.type);
        // 将options存入本地存储

        birthAlert('', function(result) {
            console.log(result);
            $scope.$emit('changeBirth', result.status);
        })
        fetchOptions('', function(result) {
          localStorage.setItem('options', JSON.stringify(result));
          $scope.$apply(function() {
            $location.path('/' + $cookies.get('user_id'));
          })
          
        })

        fetchPlanCouOp('', function(result) {
          localStorage.setItem('courses', JSON.stringify(result));
        })

      }else{
        alert('用户名或密码错误');
      }
    }
  })
  