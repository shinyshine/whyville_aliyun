/**
 * Created by luoxiaotong on 2016/4/19.
 */
'use strict';
angular.module('homeApp.operating')
  .controller('addEmp', function($scope, $location, $routeParams, fetchOptions, initEmpForm, submitEmpInfo, previewImage) {
    fetchOptions('', function(result) {
      $scope.$apply(function() {
        $scope.options = {
          "schools": result.schools,
          "jobs": result.jobs
        }
      })
    })

    $scope.employeeInfo = initEmpForm($routeParams.emp_id);
    
   //图片预览效果
    previewImage(function(ext_name) {
      console.log(ext_name);
      $scope.employeeInfo.emp_pic.ext_name = ext_name;
      $scope.$apply();
    })
    $scope.submitInfo = function(valid) {
      if(valid) {
        var postData = $scope.employeeInfo;
        if(postData.emp_sch.id && postData.emp_job.id) {
           submitEmpInfo(postData, function(result) {
              if(result.status) {
                alert('添加成功');
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
  .controller('modifyEmp', function($scope, $location, $routeParams, fetchOptions, fetchEmpById, modifyEmp, modifyComment) {
    $scope.sidebar = [{
      "name": '基本信息',
      "link": '#basic',
      "default": 1
    },{
      "name": '员工评价',
      "link": '#comment'
    }]

    fetchOptions('', function(result) {
      $scope.$apply(function() {
        $scope.options = {
          "schools": result.schools,
          "jobs": result.jobs
        }
      })
    })
    fetchEmpById($routeParams, function(result) {
      console.log(result)
      $scope.employeeInfo = result;

      var picPath = API + result.info.emp_pic;
      $scope.employeeInfo.info.emp_pic = picpath;
      $scope.$apply();
    })

    $scope.modifyEmp = function() {
      console.log($scope.employeeInfo.info);
      modifyEmp($scope.employeeInfo.info, function(result) {
        if(result.status) {
          alert('修改成功');
          $scope.$apply(function() {
            $location.path('/employees');
          })
        }
      })
    }

    $scope.submitCom = function() {
      $scope.employeeInfo.comment.emp_id = $routeParams.emp_id
      modifyComment($scope.employeeInfo.comment, function(result) {
        if(result.status) {
          alert('修改成功');
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
      $scope.employeeInfo.info.emp_pic = picpath;
      $scope.$apply();
    })
  })

