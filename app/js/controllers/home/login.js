'use strict';
angular.module('homeApp.home')
	.controller('login', function($scope, $location, $cookies, login, fetchOptions) {
		$scope.user = {
			"user_id": '',
			"user_pwd": ''
		}

		$scope.login = function(valid) {
			if(valid) {
				login($scope.user, callBack);
			}else{
				alert('请完善登录信息');
			}
			
		}

		var callBack = function(result) {
			var status = result.status;
			if(status == 1) {

				/*$cookies.put('authority', result.authority);
				$cookies.put('user_name', result.user_name);
				$cookies.put('sch_name', result.sch_name);
				$cookies.put('user_id', result.user_id);
				$cookies.put('sch_id', result.sch_id);
				$cookies.put('type', result.type);*/
				$scope.$apply(function() {
					fetchOptions('', function(result) {
						localStorage.setItem('options', JSON.sringify(result));
						// localStorage.setItem('pay_method', result.pay_method);
						// localStorage.setItem('linkCourse', result.linkCourse);
						// localStorage.setItem('schools', result.schools);
						// localStorage.setItem('jobs', result.jobs);
						// localStorage.setItem('publics', result.publics);
					})
					$location.path("/" + $cookies.get('user_id')); 
				});	
			}else{
				alert('用户名或密码错误');
			}
		}
	})
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
				modifyPwd($scope.postData, function(result) {
					if(result.status) {
						alert('成功修改密码');
						$scope.$apply(function() {
							$location.path('/');
						})
					}
				})
			}
			
		}	
	})