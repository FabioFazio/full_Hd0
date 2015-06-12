// Extra actions on successfull submit
fallbackForm['auth'] = function fallback (data, status, $msgBox, $form) {
	// Update interface
	if(typeof data['id'] == 'undefined')
		return;
	
    var name = $('#auth_name').val()? $('#auth_name').val() : $('#auth_username').val();
    $('#name').html(name);
    
	// Save data to cookie too
	var cookies	=	[];
	var user	=	{
			'id':				data['id'],
			'name':				data['name'],
			'email':			data['email'],
			'username':			data['username'],
			'password':			data['password'],
			'administrator':	data['administrator'],
			'fullname':			data['fullname'],
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
			async: true, // default true
			success: function(data, status) {
				window.console&&console.log(data); // for debugging
				var names	= [	'user',
				         	 	'queues' ];
				
				$.each( names, function (i, v) {
					$.removeCookie (v, { path: cookiePath });	
				});
				
				toastr["success"] (data["alert-success"]);

				setTimeout(location.reload(), 5000);
			},
			error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
			},
		});
	}
}

function isFocalpoint()
{
	return getQueues(true).length;
}

function getQueues (focalpoint, indexed)
{
	var queues = false;
	
	if (authenticated)
	{
		queues = JSON.parse($.cookie("queues"));
	}
	if(focalpoint)
	{
		queues = $.grep(queues, function( v, index ) { return ( v.focalpoint );});
	}
	if (indexed)
	{
		obj = {};
		$.each(queues, function(i,v){
			obj[v.id] = v;
		});
		queues = obj;
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
