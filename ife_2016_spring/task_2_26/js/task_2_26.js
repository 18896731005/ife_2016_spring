//实现太空全局对象，用来存取飞船对象，设置最大轨道数
var Space = {
	maxRailNum:4,
	container:{},//存放飞船的对应信息
	ctrPaneler:{},//存放控制面板中对应信息
	craftTimer:[],//存储对应飞船的计时器
	locationRec:[1,1,1,1],//用来记录位置信息，便于停止后再开始的话从原位置开始
	railIsBusy:[false,false,false,false],//记录当前轨道上是否有飞船
	count:0,
	setCraft:function(index,aircraftObj){
		Space.container[index] = aircraftObj;
	},
	getCraft:function(index){
		return Space.container[index];
	},
	deleteCraft:function(index){
		if(Space.container[key] && key == index){
			Space.container[key] = {};
		}
	},
	setCtrPanel:function(index,ctrPanelObj){
		Space.ctrPaneler[index] = ctrPanelObj;
	},
	getCtrPanel:function(index){
		return Space.ctrPaneler[index];
	},
	deleteCtrPanel:function(index){
		if(Space.ctrPaneler[key] && key == index){
			Space.ctrPaneler[key] = {};
		}
	}
};
//实现飞船对象
var Aircraft = function(){
	function Aircraft(){};
	Aircraft.prototype.init = function(config){
		this.config = config;
		this.create(this.config.index);//创建
		return this;
	}
	Aircraft.prototype.start = function(index,obj){//开始飞行
		var self = this;
		$(obj).prop('disabled','disabled');
		$(obj.nextSibling).prop('disabled',false);//按钮的启用与禁用

		var craft = $(".planet_rail_"+index)[0];
		(function(_index){//主体部分，旋转和能量更改,采用立即执行方式避免定时器混乱
			if(Space.craftTimer[_index-1]){//如果定时器存在则先清掉，遇到的最大的坑
				clearInterval(Space.craftTimer[_index-1]);
			}
			Space.craftTimer[_index-1] = setInterval(function(){
				var count = Space.locationRec[_index-1];//获取飞船当前位置
				//飞船转动控制
				craft.style.transform = "rotate("+18*self.config.speed*count+"deg)";
				//飞船能量控制
				var ener = 100-5*self.config.speed*count;
				self.calcEnergy(ener,craft);
				//更新位置
				count ++;
				if(count > 20/self.config.speed){
					count = 1;
					/*clearInterval(Space.craftTimer[_index-1]);
					Space.craftTimer[_index-1] = null;*/
				}
				Space.locationRec[_index-1] = count;
			}, 500);
		})(index);
	}
	Aircraft.prototype.stop = function(index,obj){//停止
		$(obj).prop('disabled',true);
		$(obj.previousSibling).prop('disabled',false);
		clearInterval(Space.craftTimer[index-1]);
	}
	Aircraft.prototype.destroy = function(index){//摧毁
		$(".planet_rail_"+index).remove();//销毁飞船及轨道
		Space.railIsBusy[index-1] = false;//更改是否占轨道标志
		Space.count--;//更改空间中飞船数量
	}
	Aircraft.prototype.calcEnergy = function(value,obj){//计算能量后更改显示
		var energyFig = obj.firstElementChild.firstElementChild;//获取指示能量的div
		var energyText = obj.firstElementChild.lastElementChild;//获取显示能量数值的span
		energyFig.style.width = value + "%";
		energyText.innerHTML = value + "%";
	}
	Aircraft.prototype.create = function(){
		$(".display_part").append('<div class="planet_rail_'+this.config.index+'">'+
								  	'<div class="aircraft_'+this.config.index+'">'+
										'<div class="aircraft_energy_'+this.config.index+'"></div>'+
										'<span class="aircraft_energy_num_'+this.config.index+'">100%</span>'+
								  	'</div>'+
								   '</div>');
	}
	return Aircraft;
}()
//实现控制面板对象
var Control = function(){
	function Control(){};
	Control.prototype.init = function(config){
		 this.config = config;
		 this.create(this.config.index); 
		 this.bindEvent();
	};
	Control.prototype.create = function(){
		$(".control_part").append('<div class="control_row_'+this.config.index+'">'+
								  	'<span>'+this.config.index+'号飞船控制面板</span>'+
								  	'<button>开始飞行</button>'+
								  	'<button disabled>停止飞行</button>'+
								  	'<button>销毁飞船</button>'+
								  '</div>')
	};
	Control.prototype.deletePanel = function(index){
		$(".control_row_"+index).remove();//销毁对应的控制面板
	};
	Control.prototype.bindEvent = function(){
		var control_eles = $('[class ^= "control_row_"]');
		$(control_eles[this.config.index-1]).on('click',function(e) {
			var e = e || window.event;
			var targetEle = e.target || e.srcElement;
			var targetEleClsname = targetEle.parentNode.className;
			var targetCon = targetEle.innerHTML;
			var railIndex = targetEleClsname.charAt(targetEleClsname.length-1);

			setTimeout(function(){//模拟指令延迟一秒到达
				var newConsole = new Console();//新建一个指令对象
				if(Math.random()>0.3){//模拟0.3概率的丢包
					var craft = Space.getCraft(railIndex);//获取到飞船对象
					var ctrpanel = Space.getCtrPanel(railIndex);//获取到控制面板对象
					if(targetCon == '开始飞行'){
						//显示指令以及开始飞行
						newConsole.init({currTime:currTime(),index:railIndex,command:'开始飞行',state:'success'});
						craft.start(railIndex,targetEle);
					}else if(targetCon == '停止飞行'){
						//显示指令以及停止飞行
						newConsole.init({currTime:currTime(),index:railIndex,command:'停止飞行',state:'success'});
						craft.stop(railIndex,targetEle);
					}else if(targetCon == '销毁飞船'){
						//显示指令以及销毁飞船及控制面板
						newConsole.init({currTime:currTime(),index:railIndex,command:'被销毁',state:'success'});
						craft.destroy(railIndex);
						ctrpanel.deletePanel(railIndex);
					}
				}else{
					if(targetCon == '开始飞行'){
						newConsole.init({currTime:currTime(),index:railIndex,command:'开始飞行',state:'failed'});
					}else if(targetCon == '停止飞行'){
						newConsole.init({currTime:currTime(),index:railIndex,command:'停止飞行',state:'failed'});
					}else if(targetCon == '销毁飞船'){
						newConsole.init({currTime:currTime(),index:railIndex,command:'被销毁',state:'failed'});
					}
				}
			},1000)
		});
	};

	return Control;
}()
//实现指令显示对象
var Console = function(){
	function Console(){};
	Console.prototype.init = function(config){
		 this.config = config;
		 this.publishCode(); 
	};
	Console.prototype.publishCode = function(){
		 if(this.config.state == 'success'){//成功接收到包
		 	var contentObj = $(".console_content")[0]
		 	$(contentObj).append('<span style="color:green;">'+
		 								this.config.currTime+this.config.index+"号飞船"+this.config.command+
		 							  '</span>');
		 	contentObj.scrollTop = contentObj.scrollHeight;//设置使滚动条总是出现在最下边
		 }else if(this.config.state == 'failed'){//指令包丢失
		 	var contentObj = $(".console_content")[0]
			$(contentObj).append('<span style="color:red;">'+
		 								this.config.currTime+this.config.index+"号飞船"+this.config.command+
		 							  '的指令丢包了</span>');
			contentObj.scrollTop = contentObj.scrollHeight;//设置使滚动条总是出现在最下边
		 }
	};
	return Console;
}()
//入口
$(function(){
	//为新建新的飞船按钮绑定事件
	$(".newAircraft").on("click",function(){
		var currNum = Space.count;//当前空间中有飞船数量
		if(currNum == 4){
			alert("当前空间中已经有4艘飞船，不可再添加！！！");
		}else{
			//先判读哪条轨道上没有飞船
			var index;
			for(var i=0,len=Space.railIsBusy.length; i<len; i++){
				if(!Space.railIsBusy[i]){
					index = i+1;
					break;
				}
			}
			setTimeout(function(){//模拟指令延迟一秒到达
				if(Math.random()>0.3){//模拟0.3的概率丢包
					//空间中添加飞船
					var newAircraft = new Aircraft();
					newAircraft.init({index:index,speed:1});
					Space.setCraft(currNum+1,newAircraft);
					//控制面板中添加飞船控制信息
					var newControlPanel = new Control();
					newControlPanel.init({index:index});
					Space.setCtrPanel(currNum+1,newControlPanel);
					//更改空间中关于飞船的计数
					Space.count++;
					Space.railIsBusy[index-1] = true;
					//添加指令信息
					var newConsole = new Console();
					newConsole.init({currTime:currTime(),index:index,command:'被新加入宇宙空间',state:'success'});
				}else{
					//添加指令信息
					var newConsole = new Console();
					newConsole.init({currTime:currTime(),index:index,command:'被新加入宇宙空间',state:'failed'});
				}
			}, 1000)
		}
	})
})