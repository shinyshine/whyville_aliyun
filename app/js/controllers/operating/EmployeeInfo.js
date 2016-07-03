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

                $location.path('/employees');
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
      console.log(result)
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

