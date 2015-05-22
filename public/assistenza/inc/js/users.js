/* Library for users.inc */
function usersLoad(e)
{
    //var $related = $(e.relatedTarget);
    var $current = $(e.currentTarget);
    
	$('[data-toggle="confirmation"]').confirmation();
	
	// ^ editor animation
	$current.on('click', '[data-show]', function(){
		target = $(this).attr('data-show');
		$(target).fadeIn();
		window.location = target;
	});
	
	$current.on('click', '[data-hide]', function(){
		target = $(this).attr('data-hide');
		$(target).fadeOut();
	});
	// $ editor animation
	
	
	
	//var user = getUser();
}