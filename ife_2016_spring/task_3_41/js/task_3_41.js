$(function(){

	$("#caleSelect").on("focus",function(){
		$.calender(".container");
	})

	$(".container img").on("click",function(){
		var calEle = $(".daySelect")[0];
		if(calEle == undefined){
			$.calender(".container");
		}else{
			$(".monAndYearSelect,.daySelect").remove();
		}
	})
})