/* Library for users.inc */
function usersLoad(e)
{
    //var $related = $(e.relatedTarget);
    var $current = $(e.currentTarget);
    var users = $('#users').dataTable(table_users_options).api();
	
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
	users.rows().remove();
	users.draw();
	// $ clean old data

	$.ajax({
		url:			users_url,
		type:			"POST",
		datatype:		"json",
		data:{
			secret:			getUser().password
		},
		async: true,
		success: function(data, status) {
			window.console&&console.log(data); // for debugging
			populateUsers(users, data['users']);
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
			},
	});
}

function populateUsers(users, data){
	$edit = $('<a></a>').attr('title','Modifica')
		.addClass('btn btn-sm btn-info').attr('data-show','#usersEditor');
	$remove = $('<a></a>').attr('title','')
		.addClass('btn btn-sm btn-danger').attr('data-toggle','confirmation').
		attr('data-original-title', 'Vuoi davvero cancellare questo utente in modo permanente?');
	$edit.html('<span class="glyphicon glyphicon-pencil"></span>');
	$remove.html('<span class="glyphicon glyphicon-trash"></span>');
	$.each(data, function(index, user){
		users.row.add([
           $('<div>&nbsp;</div>').prepend($edit.clone().attr('data-id',user.id))
           		.append($remove.clone().attr('data-id',user.id)).html(),
           user.username,
           user.name,
           user.email==user.username?'':user.email,
           $('<div>').append($('<span>').attr('data-value',user.password).text('*****')).html(),
           $('<div>').append($('<span>').attr('data-value',user.sector.id).text(user.sector.fullname)).html(),
           $('<div>').append($('<span>').attr('data-value',JSON.stringify(user.queues)).text(user.queues.length)).html(),
           $('<div>').append($('<span>').attr('data-value',JSON.stringify(user.focalpoint)).text(user.focalpoint.length)).html(),
    	   $('<div>').append($('<i class="glyphicon">')
    			   .addClass(user.administrator?'glyphicon-ok alert-success':'glyphicon-remove alert-danger')
    			   .attr('data-value',user.administrator)).html(),
       ]);
	});
	
	//.prop('queues',item.queues).prop('focalpoint', item.focalpoint)
	users.draw();
	$('[data-toggle="confirmation"]').confirmation(confirmation_delete_options);
}