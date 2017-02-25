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