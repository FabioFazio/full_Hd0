// Extra actions on successfull submit
fallbackForm['auth'] = function fallback (data, status, $msgBox, $form) {
	// Update interface
    var name = $('#auth_name').val()? $('#auth_name').val() : $('#auth_username').val();
    $('#name').html(name);
	
	// Save data to cookie too
	var cookies	=	[];
	var user	=	{
			'id':		data['id'],
			'username':	data['username'],
			'name':		data['name'],
			'email':	data['email'],
			//'queues':	data['queues'],
		};
	setUser( user );
	
	cookies.push( { name : 'queues', value : JSON.stringify(data['queues']) } );
	
	cookiesGenerator( cookies );
	authenticated = true;
};

/**
 * Logooff function
 */
function logoff()
{
	if (authenticated)
	{
		$.ajax({
			url:			logoff_url,
			type:			"POST",
			datatype:		"json",
			data:{
				username:		$('#auth_username').val(),
			},
			async: false, // default true
			success: function(data, status) {
				window.console&&console.log(data); // for debugging
				var names	= [	'user',
				         	 	'queues' ];
				
				$.each( names, function (i, v) {
					$.removeCookie (v, { path: cookiePath });	
				});
				
				toastr["success"] (data["alert-success"]);
				
				toastr.options = {
				  "closeButton": false,
				  "debug": false,
				  "newestOnTop": false,
				  "progressBar": false,
				  "positionClass": "toast-top-right",
				  "preventDuplicates": false,
				  "onclick": null,
				  "showDuration": "300",
				  "hideDuration": "1000",
				  "timeOut": "5000",
				  "extendedTimeOut": "1000",
				  "showEasing": "swing",
				  "hideEasing": "linear",
				  "showMethod": "fadeIn",
				  "hideMethod": "fadeOut"
				}
				
				setTimeout(location.reload(), 5000);
			},
			error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
			},
		});
	}
}

function getQueues ()
{
	var queues = false;
	
	if (authenticated)
	{
		queues = JSON.parse($.cookie("queues"));
	}
	return queues;
}

function getUser ()
{
	var user = false;
	
	if (authenticated)
	{
		user = JSON.parse($.cookie("user"));
	}
	return user;
}

function setUser ( user )
{
	if (user)
	{
		var jsonUser = JSON.stringify ( user ); 
		cookiesGenerator ( [ {name: 'user', value : jsonUser} ] );
	}
}
