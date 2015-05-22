/* Library for users.inc */
function usersLoad(e)
{
    //var $related = $(e.relatedTarget);
    var $current = $(e.currentTarget);
    
	$('[data-toggle="confirmation"]').confirmation({
			btnOkLabel: 'Cancella',
			btnCancelLabel: 'Annulla',
			singleton: true,
			popout: true,
			onConfirm: function(){},
		});
	
	// ^ editor animation
	$current.on('click', '[data-show]', function(){
		var target = $(this).attr('data-show');
		var twin = $(target).attr('data-flip');
		$(target).add(twin).toggleClass('hidden');
	});
	
	$current.on('click', '[data-hide]', function(){
		var target = $(this).attr('data-hide');
		var twin = $(target).attr('data-flip');
		$(target).add(twin).toggleClass('hidden');
	});
	// $ editor animation
	
	// ^ clean old data
	// $ clean old data

	// ^ load new data
	// $ load new data
	
	//var user = getUser();
}