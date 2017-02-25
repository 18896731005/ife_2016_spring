var result = [];//存放遍历结果
var timer = null;

window.onload = function(){
	//获取包裹层节点
	var headNode = document.getElementById("wrapper");
	//遍历节点并存入数组中
	preOrder(headNode);
	//为开始遍历按钮绑定事件
	document.getElementById("order").onclick = function(){
		startAnimate();
	}
	//为查找按钮绑定事件
	document.getElementById("searchAct").onclick = function(){
		var searchContent = document.getElementById("inputCon").value;
		//输入验证
		if(!searchContent){
			alert("请输入要查找的内容...")
		}else{
			startAnimate(searchContent);	
		}
	}
}
//递归前序遍历元素节点
function preOrder(node){
	if(node){
		result.push(node);
	}

	var nodelist = node.children;
	if(nodelist){
		for(var i=0; i<nodelist.length;i++){
			if(nodelist[i].nodeType == 1){
				result.push(preOrder(nodelist[i]))
			}
		}
	}
	//修正结果result，去掉其中空元素
	for(var i=0; i<result.length; i++){
		if(result[i] === undefined){
			result.splice(i,1);
			i--;
		}
	}
}
//添加动画执行函数
function startAnimate(con){
	var flag = true;//用来记录是开启遍历动画还是搜索动画,默认为true，开启遍历
	if(arguments.length == 1){
		flag = false;
	}
	var i = 0;
	result[i].style.backgroundColor = 'blue';
	timer = setInterval(function(){
		i++;
		if(flag){//开启遍历动画
			if(i < result.length){
				result[i-1].style.backgroundColor = '#fff';
				result[i].style.backgroundColor = 'blue';
			}else{
				clearInterval(timer);
				result[result.length-1].style.backgroundColor = '#fff';
			}
		}else{//开启查找动画
			if(result[i] && result[i].firstChild){
				var currCon = result[i].firstChild.nodeValue.replace(/^(\s+)|(\s+)$/g,"");//读取字符串并删除两端空格
			}
			
			if(i < result.length && con !== currCon){
				result[i-1].style.backgroundColor = '#fff';
				result[i].style.backgroundColor = 'blue';
			}else if(i < result.length && con === currCon){
				result[i-1].style.backgroundColor = '#fff';
				result[i].style.backgroundColor = 'red';
				clearInterval(timer);
			}else{
				clearInterval(timer);
				result[result.length-1].style.backgroundColor = '#fff';
				alert("没有查找到对应的内容，请重新检查输入");
			}
		}
	}, 1000)
}