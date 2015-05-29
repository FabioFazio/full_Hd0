// Extra actions on successfull submit
fallbackForm['storeForm'] = function fallback (data, status, $msgBox, $form) {
	$.each(data, function(i, msg){
		if($.inArray(i,['success','error','warning','info'])>=0){
			toastr[i](msg);
		}
	});
	if (!('error' in data)){
		storesLoad();
	}
};

/* Library for users.inc */
function storesInit()
{
	var $modal = $( '#storesModal' ); 
	$modal.find('div.modal-xl').css( "width", $(window).innerWidth()-50 );
    tableStores = tableStores?tableStores:$('#stores').dataTable(table_stores_options).api();
	
	// ^ editor animation
    $modal.on('click', '[data-show]', function(){
		var target = $(this).attr('data-show');
		var twin = $(target).attr('data-flip');
		storeEditorInit(target, this);
		$(target).add(twin).toggleClass('hidden');
	});
	
    $modal.on('click', '[data-hide]', function(){
		var target = $(this).attr('data-hide');
		var twin = $(target).attr('data-flip');
		$(target).add(twin).toggleClass('hidden');
	});
	// $ editor animation
}

function storesLoad(e)
{
	//var refresh = (typeof e !== 'undefined')?true:false;
	
	// ^ clean old data
	tableStores.rows().remove();
	tableStores.draw();
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
			populateStores(data['users']);
			$( '#storesModal' ).prop('stores', data['users']);
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
			},
	});
}

function storeEditorInit(target, button){
	// ^ reset old data
	var id = $(button).attr('data-id');

	$(target).find('input').val('');
	$(target).find('input[name="id"]').val(id);
	$(target).find('input[name="secret"]').val(getUser().password);
	
	// ^ reset select
	var $sector = $(target).find('select[name="sector"]');
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
					$sector = $(target).find('select[name="sector"]');
					if ($sector.find('option[value="'+v.id+'"]').length<1)
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

	// $ reset old data
	
	// ^ populate new data

	if (id>0)
	{
		var users = $( '#usersModal' ).prop('users');
		if (id in users){
			var user = users[id];
			$(target).find('input[name="username"]').val(user.username).prop('disabled', true);
			$(target).find('input[name="name"]').val(user.name);
			$(target).find('input[name="email"]').val(user.email==user.username?'':user.email);
			$('#pass').collapse('hide');
			
			if (user.sector!=null)
			{
				var $sector = $(target).find('select[name="sector"] option[value="'+user.sector.id+'"]');
				if ($sector.length<1){
					$('#usersModal').find('select[name="sector"]')
						.append($('<option>').val(user.sector.id).text(user.sector.fullname));
				}
				$(target).find('select[name="sector"]').val(user.sector.id);
			} else
				$(target).find('select[name="sector"]').val(0);

			
			$(target).find(':checkbox[name="administrator"]').prop('checked', user.administrator);
			
			
			if (user.queues.length){
				$.each(user.queues, function(i,q){
					if (selectQueues.find('option[value="'+q.id+'"]').length<1){
						selectQueues.append($('<option data-history>').val(q.id).text(q.name));
					}
					selectQueues.find('option[value="'+q.id+'"]').attr('selected','selected');
				});
				selectQueues.bootstrapDualListbox('refresh', true);
			}
			if (user.focalpoint.length){
				$.each(user.focalpoint, function(i,q){
					if (selectFps.find('option[value="'+q.id+'"]').length<1){
						selectFps.append($('<option data-history>').val(q.id).text(q.name));
					}
					selectFps.find('option[value="'+q.id+'"]').attr('selected','selected');
					
				});
				selectFps.bootstrapDualListbox('refresh', true);
			}
		}else{
			toastr['error']
				('Non &egrave; stato possibile caricare l\'utente. Segnalare questo problema agli amministratori del servizio!');
		}
	}else{
		$(target).find('input[name="username"]').prop('disabled', false);
		$('#pass').collapse('show');
	}
	
	// $ populate new data

}

function populateStores(data){
	$edit = $('<a></a>').attr('title','Modifica')
		.addClass('btn btn-sm btn-info').attr('data-show','#usersEditor');
	$remove = $('<a></a>').attr('title','')
		.addClass('btn btn-sm btn-danger').attr('data-toggle','confirmation').
		attr('data-original-title', 'Vuoi davvero cancellare questo utente in modo permanente?');
	$edit.html('<span class="glyphicon glyphicon-pencil"></span>');
	$remove.html('<span class="glyphicon glyphicon-trash"></span>');
	$.each(data, function(index, user){
		var sector = user.sector?user.sector.fullname:'';
		var $editButton = $edit.clone().attr('data-id',user.id);
		var $removeButton = $remove.clone().attr('data-id',user.id);
		if(user.id==getUser().id){
			$editButton.attr('disabled','disabled');
			$removeButton.attr('disabled','disabled');
		}
		
		tableStores.row.add([
           $('<div>&nbsp;</div>').append($removeButton)
           		.prepend($editButton).html(),
           user.username,
           user.name,
           user.email==user.username?'':user.email,
           $('<div>').append($('<span>').text('*****')).html(),
           $('<div>').append($('<span>').text( sector )).html(),
           $('<div>').append($('<span>').text(user.queues.length)).html(),
           $('<div>').append($('<span>').text(user.focalpoint.length)).html(),
    	   $('<div>').append($('<i class="glyphicon">')
    			   .addClass(user.administrator?'glyphicon-ok alert-success':'glyphicon-remove alert-danger')
    			   .attr('data-value',user.administrator)).html(),
       ]);
	});
	
	tableStores.draw();
	$('a[data-toggle="confirmation"]').confirmation(confirmation_delete_options);
}

function storeDelete(toastr, item)
{
	$.ajax({
		url:			user_delete_url,
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
				tableStores.row('.remove').remove().draw( false );
			}
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
				toastr['error'] = 'Non è stato possibile rimuovere l\'utente. Riprovare più tardi.';
			},
	});
}