// Extra actions on successfull submit
fallbackForm['auth'] = function fallback (data, status, $msgBox, $form) {
	// Update interface
	if(typeof data['id'] == 'undefined')
		return;
	
    var name = $('#auth_name').val()? $('#auth_name').val() : $('#auth_username').val();
    $('#name').html(name);
    
	// Save data to cookie too
	var cookies	=	[];
	var queues = [];
	var filters	=	{};
	var user	=	{
			'id':				data['id'],
			'name':				data['name'],
			'email':			data['email'],
			'username':			data['username'],
			'password':			data['password'],
			'administrator':	data['administrator'],
			'fullname':			data['fullname'],
		};
	cookies.push( { name : 'user', value : escapeCookie(JSON.stringify(user)) } );
	
	$.each( data['queues'], function(i,queue){
		if (typeof (queue.filters)!= 'undefined' && queue.filters){
			filters[queue.filters.id] = queue.filters;
			queue.filters = queue.filters.id;
		}
		queues.push(queue);
	});
	$('form#auth').prop('filters',filters);
	cookies.push( { name : 'queues', value : escapeCookie(JSON.stringify(queues)) } );
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
		queues = JSON.parse( unescapeCookie ($.cookie("queues")));
	}
	if(focalpoint)
	{
		queues = $.grep(queues, function( v, index ) { return ( v.focalpoint );});
	}
	
	var withFilters = [];
	$.each(queues, function(i,v){
		if(v.filters)
			v.filters = $('form#auth').prop('filters')[v.filters];
		withFilters.push(v);
	});
	queues = withFilters;
	
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
		user = JSON.parse(unescapeCookie(($.cookie("user"))));
	}
	return user;
}

function setUser ( user )
{
	if (user)
	{
		cookiesGenerator ( [ {name: 'user', value : escapeCookie(JSON.stringify(user))} ] );
	}
}
