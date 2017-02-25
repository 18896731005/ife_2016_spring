(function($){
	$.calender = function(selector){
		//如果已经调出来日历的话先移除掉
		$(".monAndYearSelect,.daySelect").remove();

		$(selector).append(
			'<div class="monAndYearSelect">'+
				'<select id="month"></select>'+
				'<select id="year"></select>'+
			'</div>'+
			'<div class="daySelect">'+
				'<table>'+
					'<thead></thead>'+
					'<tbody></tbody>'+
				'</table>'+
			'</div>'
		);
		//读取当前日期
		var now = new Date(),
			currYear = now.getFullYear(),
			currMonth = now.getMonth()+1,
			currDate = now.getDate(),
			currDay = now.getDay();
		//添加月份选择
		for(var i=1; i<13; i++){
			var optionEle = document.createElement('option');
			optionEle.value = i + '月';
			optionEle.innerHTML = i + '月';
			if(i == currMonth){
				optionEle.selected = 'selected';
			}
			$("#month").append(optionEle);
		}
		//为月份select绑定onchange事件
		$("#month").on('change',function(e){
			var currMonth = parseInt(this.selectedOptions[0].value.split("月")[0]);
			var currYear = parseInt(document.getElementById("year").selectedOptions[0].value.split("年")[0]);
			addDateInfo(currYear,currMonth);
		})
		//添加年份选择
		for(var i=-10;i<10;i++){
			var optionEle = document.createElement('option');
			optionEle.value = (currYear + i) + '年';
			optionEle.innerHTML = (currYear + i) + '年';
			if(i == 0){
				optionEle.selected = 'selected';
			}
			$("#year").append(optionEle);
		}
		//为nian份select绑定onchange事件
		$("#year").on('change',function(e){
			var currYear = parseInt(this.selectedOptions[0].value.split("年")[0]);
			var currMonth = parseInt(document.getElementById("month").selectedOptions[0].value.split("月")[0]);
			addDateInfo(currYear,currMonth);
		})
		//添加日期表头
		var dayArr = ['日','一','二','三','四','五','六'];
		var trEle = document.createElement('tr');
		for(var i=0;i<7;i++){
			var thEle = document.createElement('th');
			thEle.innerHTML = dayArr[i];
			trEle.appendChild(thEle);
		}
		$(".daySelect table thead").append(trEle);
		//添加日期信息,初始化加载
		addDateInfo(currYear,currMonth);
		//添加日期信息函数
		function addDateInfo(year,month){
			//如果已经调出来日历的话先移除掉
			$(".daySelect table tbody tr").remove();
			//首先判断当前月份有几天，函数在util.js中
			var sumCurrDate = howManyDate(year,month);
			//判断上个月有几天
			var sumPrevDate = howManyDate(year,month-1);
			//计算本月的第一天为星期几
			var firstDay = new Date(year+"/"+month+"/"+1).getDay();
			//添加本页中可显示的上月日期
			var trEle = document.createElement('tr');
			for(var start = (sumPrevDate-firstDay+1);start<=sumPrevDate;start++){
				var tdEle = document.createElement('td');
				tdEle.innerHTML = start;
				tdEle.className = 'prevMonth';
				trEle.appendChild(tdEle);
			}
			//添加本页上本月的日期信息
			for(var start = 1; start<=sumCurrDate;start++){
				var tdEle = document.createElement('td');
				tdEle.innerHTML = start;
				tdEle.className = 'currMonth';
				if(start == currDate){
					tdEle.className = 'currMonth currDate';
				}
				trEle.appendChild(tdEle);
			}
			//添加本页上可以显示的下个月的日期信息
			//首先获取本月最后一天为星期几
			var lastDay = new Date(year+"/"+month+"/"+sumCurrDate).getDay();
			if(lastDay !== 6){
				for(var start = 1;start <= (6-lastDay);start++){
					var tdEle = document.createElement('td');
					tdEle.innerHTML = start;
					tdEle.className = 'nextMonth';
					trEle.appendChild(tdEle);
				}
			}
			//将日期信息加到tbody中
			$(".daySelect table tbody").append(trEle);

			//为日期添加点击事件
			$(".currMonth").on("click",function(e){
				var currYear = document.getElementById("year").selectedOptions[0].value;
				var currMonth = document.getElementById("month").selectedOptions[0].value;
				var currDate = e.target.innerHTML + '日';
				document.getElementById("caleSelect").value = currYear +""+currMonth+""+currDate;
				$(".monAndYearSelect,.daySelect").remove();
			})
		}
	}
})($)