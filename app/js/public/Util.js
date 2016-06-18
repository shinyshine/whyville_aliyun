var ROOT = 'http://120.25.229.249:80/app/#/';
var API = 'http://120.25.229.249:8001';

var num_per_page = 12;
function transformSchArr(arr) {
	var options = [];
	for (var i = 0, len = arr.length; i < len; i++) {
		var item = {
			"id": arr[i].school_id,
			"name": arr[i].school_name
		};
		options.push(item);
	}
	return options;
}

function getCurrentDate() {
	var myDate = new Date(),
		Y = myDate.getFullYear(),
		M = myDate.getMonth() + 1,
		D = myDate.getDate();
	return Y + '-' + M + '-' + D;

}

//检查如期格式
function isDate(str) {
	var result = str.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
	if (result == null) {
		//alert("请输入正确的日期格式");
		return false;
	}else{
		return true;
	}

}
//检查时间格式
function isTime(str) {
	console.log(str)
	var a = str.match(/^(\d{1,2})(:)?(\d{1,2})$/);
	if (a == null) {
		return false;
	}
	if(!a[2]) {
		return false;
	}else if (a[1] > 24 || a[3] > 60) {
		return false
	}
	return true;
}
function ajaxFileUpload(domStr, urlStr) {
	$.ajaxFileUpload({
		url: urlStr, //用于文件上传的服务器端请求地址
		secureuri: false, //一般设置为false
		fileElementId: domStr, //文件上传空间的id属性  <input type="file" id="file" name="file" />
		dataType: 'json', //返回值类型 一般设置为json
		success: function(data, status) { //服务器成功响应处理函数
			console.log(data);
			console.log(status);
		},
		error: function(data, status, e) { //服务器响应失败处理函数
			alert(e);
		}
	})
}

var postData = function(url, data, callBack) {
	$.ajax({
		url: url,
		method: 'POST',
		data: data,
		dataType: 'json',
		beforeSend: function() {
			$('.mask').show();
		},
		xhrFields: {
			withCredentials: true
		},
		success: function(result) {
			callBack(result);
		},
		complete: function() {
			$('.mask').hide();
		}
	})
}
var getData = function(url, callBack, data) {
	$.ajax({
		url: url,
		method: 'GET',
		data: data,
		dataType: 'json',
		beforeSend: function() {
			$('.mask').show();
		},
		xhrFields: {
			withCredentials: true
		},
		success: function(result) {
			callBack(result);
		},
		complete: function() {
			$('.mask').hide();
		}
	})
}

var checkInputInObj = function(obj) {
	var status = 1;
	for(var item in obj) {
		if (!obj[item]) {
			status = 0;
			break;
		}
	}
	return status;
}


