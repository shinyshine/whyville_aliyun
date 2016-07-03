'use strict';
angular.module('homeApp.home')
	.controller('login', function($scope, $location, $cookies, login, fetchOptions, fetchPlanCouOp, birthAlert) {
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

				// $cookies.put('authority', result.authority);
				$cookies.put('user_name', result.user_name);
				$cookies.put('sch_name', result.sch_name);
				//$cookies.put('user_id', result.user_id);
				// $cookies.put('sch_id', result.sch_id);
				// $cookies.put('type', result.type);
				// 将options存入本地存储
				console.log($scope);
				birthAlert('', function(result) {
			      console.log(result);
			      $scope.birthday = result.status;
			      $scope.$apply();
			    })
				fetchOptions('', function(result) {
					localStorage.setItem('options', JSON.stringify(result));
					$location.path('' + $cookies.get('user_id'));
				})

				fetchPlanCouOp('', function(result) {
					localStorage.setItem('courses', JSON.stringify(result));
				})

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
					if(result.status == 1) {
						alert('成功修改密码');
						$scope.$apply(function() {
							$location.path('/');
						})
					}
				})
			}
			
		}	
	})