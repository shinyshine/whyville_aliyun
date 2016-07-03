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
   
  })
  .controller('homeApp.header', function($scope, $cookies, birthAlert, logOut) {
    $scope.underline = function(index) {
      $('#nav').children().removeClass('active-li');
      $('#nav').children().eq(index).addClass('active-li');
    }

    birthAlert('', function(result) {
      console.log(result);
      if(result.status == 0) {
        $scope.birthday = 0;
      }else{
        $scope.birthday = 1;
      }
      $scope.$apply();
    })
    

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
  