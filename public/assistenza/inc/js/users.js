/* Library for users.inc */
function usersLoad()
{
	$( '#usersModal div.modal-xl' ).css( "width", $(window).innerWidth()-50 );
	
	$('[data-toggle="confirmation"]').confirmation();
	
	//var user = getUser();
}