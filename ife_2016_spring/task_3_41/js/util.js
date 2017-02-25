//添加按类获取的方法，兼容不支持getElementsByClass方法的浏览器
DOMUtil = {
	getElementsByClass:function(clsName){
		var resultList = [];
		if(document.getElementsByClassName){
			return document.getElementsByClassName(clsName);
		}else{
			var eles = document.getElementsByTagName('*');
			for(var i=0, len = eles.length;i < len;i++){
				if(eles[i].className === clsName){
					resultList.push(eles[i]);
				}
			}
			return resultList;
		}
	},
	removeElement:function(element){
		var parentEle = element.parentNode;
		parentEle.removeChild(element);
	}
};

//辅助函数，获取数组里某个元素的索引index
var _indexOf = function(array,key){
	if(array === null){
		return -1;
	}
	for(var i=0;i<array.length;i++){
		if(array[i] === item){
			return i;
		}
	}
	return -1;
}
//获取当前时间函数
var currTime = function(){
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	var day = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	var result = year+'年'+(month+1)+'月'+day+'日'+hour+'时'+minute+'分'+second+'秒';
	return result;
}
//判断当前月份有多少天
function howManyDate(year,month){
	if(month == 0){
		year = year - 1;
		month = 12;
	}
	//计算每个月有几天,此处对2000年这种不做判断，觉得我们应该活不到下一次了
	if(!(year%4)){//二月闰
		switch (month) {
			case 1:
				return 31;
				break;
			case 3:
				return 31;
				break;
			case 5:
				return 31;
				break;
			case 7:
				return 31;
				break;
			case 8:
				return 31;
				break;
			case 10:
				return 31;
				break;
			case 12:
				return 31;
				break;
			case 4:
				return 30;
				break;
			case 6:
				return 30;
				break;
			case 9:
				return 30;
				break;
			case 11:
				return 30;
				break;
			case 2:
				return 29;
				break;
		}
	}else{//二月平
		switch (month) {
			case 1:
				return 31;
				break;
			case 3:
				return 31;
				break;
			case 5:
				return 31;
				break;
			case 7:
				return 31;
				break;
			case 8:
				return 31;
				break;
			case 10:
				return 31;
				break;
			case 12:
				return 31;
				break;
			case 4:
				return 30;
				break;
			case 6:
				return 30;
				break;
			case 9:
				return 30;
				break;
			case 11:
				return 30;
				break;
			case 2:
				return 29;
				break;
		}
	}
}