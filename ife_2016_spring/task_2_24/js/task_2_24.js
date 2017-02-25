window.onload = function(){
	//为包裹层添加点击事件，采用事件委托原理
	document.getElementById("wrapper").onclick = function(e){
		var e = e || window.event;//兼容IE
		var targetEle = e.target || e.srcElement;//获取到点击的目标元素

		//为前一次点击进行样式初始化
		clickReset();

		//为当前点击元素添加样式
		targetEle.className += " select";

	}
	//为删除按钮绑定事件
	document.getElementById("deleteBtn").onclick = function(){
		var selectedEle = DOMUtil.getElementsByClass("select");
		DOMUtil.removeElement(selectedEle[0]);
	}
	//为添加按钮绑定事件
	document.getElementById("insertBtn").onclick = function(){
		var searchContent = document.getElementById("inputCon").value;
		var selectedEle = DOMUtil.getElementsByClass("select");

		//输入验证
		if(!searchContent){
			alert("请输入要查找的内容...")
		}else{
			//先获取当前元素的类名，用于给子元素添加类名
			var clsName = selectedEle[0].className;
			var layerNum = clsName.charAt(clsName.indexOf("_")+1);
			var newDiv = document.createElement("div");
			newDiv.className = '.layer_'+(layerNum+1);
			newDiv.style.color = 'red';//为了明显，添加了一个红色
			newDiv.innerHTML = searchContent;
			selectedEle[0].appendChild(newDiv);

			clickReset();
		}
	}
}

function clickReset(){
	var selectedEles = DOMUtil.getElementsByClass("select");

	for(var i=0,len = selectedEles.length; i<len; i++){
		var clsName = selectedEles[i].className.replace(/select/,"");
		selectedEles[i].className = clsName;
	}
}
