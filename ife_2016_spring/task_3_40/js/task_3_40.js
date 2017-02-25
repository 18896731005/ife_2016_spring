$(function(){
	$("#caleSelect").on("focus",function(){
		$.calender(".container");
	})
	$("#caleSelect").on("blur",function(){
		$(".monAndYearSelect,.daySelect").remove();
	})
})