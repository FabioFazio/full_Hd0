/* Library for users.inc */
function usersLoad(e)
{
    //var $related = $(e.relatedTarget);
    var $current = $(e.currentTarget);
    tableUsers = tableUsers?tableUsers:$('#users').dataTable(table_users_options).api();
	
	// ^ editor animation
	$current.on('click', '[data-show]', function(){
		var target = $(this).attr('data-show');
		var twin = $(target).attr('data-flip');
		initUserEditor(target, this);
		$(target).add(twin).toggleClass('hidden');
	});
	
	$current.on('click', '[data-hide]', function(){
		var target = $(this).attr('data-hide');
		var twin = $(target).attr('data-flip');
		$(target).add(twin).toggleClass('hidden');
	});
	// $ editor animation
	
	// ^ clean old data
	tableUsers.rows().remove();
	tableUsers.draw();
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
			populateUsers(data['users']);
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
			},
	});
}

function initUserEditor(target, button){
	// ^ reset old data
	$(target).find('input').val('');
	
	// ^ reset select
	$sector = $(target).find('select[name="sector"]');
	$sector.find('option[value="0"]').siblings('option').remove();
	$sector.val(0);
	$.ajax({
		url:			sectors_url,
		type:			"POST",
		datatype:		"json",
		data:{
			secret:			getUser().password
		},
		async: true,
		success: function(data, status) {
			window.console&&console.log(data); // for debugging
			$.each(data, function(i, msg){
				if($.inArray(i,['success','error','warning','info'])>=0){
					toastr[i](msg);
				}
			});
			if (!('error' in data) && ('sectors' in data)){
				$.each(data['sectors'], function(i,v){
					$sector.append($('<option>').val(v.id).text(v.fullname));
				});
			}
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' </ajaxConsole ERROR>');
			},
	});
	// $ reset select
	
	$(target).find('form').get(0).reset();

	// ^ reset multiselect

//	if (selectQueues)
//		selectQueues.destroy();
//	if (selectFps)
//		selectFps.destroy();
	
	var $mulstiselects = $('#user-queues').add('#user-fps');
	$mulstiselects.find('option').remove();
	
	$.ajax({
		url:			queues_url,
		type:			"POST",
		datatype:		"json",
		data:{
			secret:			getUser().password
		},
		async: true,
		success: function(data, status) {
			window.console&&console.log(data); // for debugging
			$.each(data, function(i, msg){
				if($.inArray(i,['success','error','warning','info'])>=0){
					toastr[i](msg);
				}
			});
			if (!('error' in data) && ('queues' in data)){
				$.each(data['queues'], function(i,v){
					$mulstiselects.append($('<option>').val(v.id).text(v.name));
				});
				selectQueues = $('#user-queues').bootstrapDualListbox(duallist_queues_options);
				selectFps = $('#user-fps').bootstrapDualListbox(duallist_fps_options);
			}
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' </ajaxConsole ERROR>');
			},
	});
	// $ reset multiselect
	
	
	// $ reset old data

}

function populateUsers(data){
	$edit = $('<a></a>').attr('title','Modifica')
		.addClass('btn btn-sm btn-info').attr('data-show','#usersEditor');
	$remove = $('<a></a>').attr('title','')
		.addClass('btn btn-sm btn-danger').attr('data-toggle','confirmation').
		attr('data-original-title', 'Vuoi davvero cancellare questo utente in modo permanente?');
	$edit.html('<span class="glyphicon glyphicon-pencil"></span>');
	$remove.html('<span class="glyphicon glyphicon-trash"></span>');
	$.each(data, function(index, user){
		tableUsers.row.add([
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
	tableUsers.draw();
	$('a[data-toggle="confirmation"]').confirmation(confirmation_delete_options);
}

function userDelete(toastr, item)
{
	$.ajax({
		url:			userDelete_url,
		type:			"POST",
		datatype:		"json",
		data:{
			secret:		getUser().password,
			id:			item.id,
		},
		async: true,
		success: function(data, status) {
			window.console&&console.log(data); // for debugging
			$.each(data, function(i, msg){
				if($.inArray(i,['success','error','warning','info'])>=0){
					toastr[i](msg);
				}
			});
			if ('success' in data){
				$tr = $('#users').find('a.btn-danger[data-id='+item.id+']').closest('tr');
				$tr.addClass('remove');
				tableUsers.row('.remove').remove().draw( false );
			}
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
				toastr['error'] = 'Non è stato possibile rimuovere l\'utente. Riprovare più tardi.';
			},
	});
}