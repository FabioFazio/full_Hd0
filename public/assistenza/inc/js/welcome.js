function welcomeLoad()
{
	if (splashscreen)
	{
	   $( '#welcome' ).modal({});
	   
	   $( '#welcome div.modal-xl' ).css( "width", $(window).innerWidth()-50 );
	   
	    $('#welcome').on('hidden.bs.modal', function (e) {
	        if (e) {
	        	if ( !authenticated ) {
		            $( '#login' ).modal({
		                keyboard : false,
		                backdrop: 'static',
		            });
	        	} else {
					content();
	            }
	        }
	    });
    }
	
	if (authenticated)
	{
		var user = JSON.parse($.cookie("user"));
		$('#name').text(user['name']);
	}
}