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