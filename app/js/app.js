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
  })
  .controller('homeApp', function($scope, $cookies) {
    $scope.user = {
      "id": $cookies.get('user_id'),
      "user_name": $cookies.get('user_name'),
      "authority": $cookies.get('authority'),
      "sch_id": $cookies.get('sch_id'),
      "sch_name": $cookies.get('sch_name')
    }
    // $scope.state = {
    //   "operating": 0,
    //   "notice": 0
    // }
    // var authority = $scope.user.authority;

    // if(authority == 0 || authority == 1 || authority == 2) {
    //   $scope.state.operating = 1
    // }
    // if(authority == 0 || authority == 1) {
    //   $scope.state.notice = 1
    // }
   

    
  })
  .controller('homeApp.header', function($scope, $cookies) {
    $scope.underline = function(index) {
      $('#nav').children().removeClass('active-li');
      $('#nav').children().eq(index).addClass('active-li');
    }

    $scope.logOut = function() {
      $cookies.remove('authority');
      $cookies.remove('user_name');
      $cookies.remove('sch_name');
      $cookies.remove('user_id');
      window.location.href = ROOT + 'login';
    }

  })
  