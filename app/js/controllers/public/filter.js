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

	