$(function(){
	if (authenticated)
	{
		var user = JSON.parse($.cookie("user"));
		$('#name').text(user['name']);
	}
});