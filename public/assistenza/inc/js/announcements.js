// Extra actions on successfull submit
fallbackForm['msgForm'] = function fallback (data, status, $msgBox, $form) {
	$.each(data, function(i, msg){
		if($.inArray(i,['success','error','warning','info'])>=0){
			toastr[i](msg);
		}
	});
	if (!('error' in data)){
		msgsLoad();
		$form.find('[data-hide]').trigger('click');
	}
};

/* Library for announcements.inc */
function msgsInit()
{
	$modal.find('div.modal-xl').css( "width", $(window).innerWidth()-50 );
    tableMsgs = tableMsgs?tableMsgs:$('#msgs').dataTable(table_msgs_options).api();
	
	// ^ editor animation
    $modal.on('click', '[data-show]', function(){
		var target = $(this).attr('data-show');
		var twin = $(target).attr('data-flip');
		msgEditorInit(target, this);
		$(target).add(twin).toggleClass('hidden');
	});
	
    $modal.on('click', '[data-hide]', function(){
		var target = $(this).attr('data-hide');
		var twin = $(target).attr('data-flip');
		$(target).add(twin).toggleClass('hidden');
	});
	// $ editor animation
}

function msgsLoad(e)
{
	// ^ clean old data
	tableMsgs.rows().remove();
	tableMsgs.draw();
	// $ clean old data

	$.ajax({
		url:			msgs_url,
		type:			"POST",
		datatype:		"json",
		data:{
			secret:			getUser().password
		},
		async: true,
		success: function(data, status) {
			window.console&&console.log(data); // for debugging
			populateMsgs(data['msgs']);
			$modal.prop('msgs', data['msgs']);
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
			},
	});
}

function msgEditorInit(target, button){
	// ^ reset old data
	var id = $(button).attr('data-id');

	$(target).find('input').val('');
	$(target).find('input[name="id"]').val(id);
	$(target).find('input[name="secret"]').val(getUser().password);
	
	// ^ reset select
	var $sector = $(target).find('select[name="sector"]');
	$sector.find('option[value="0"]').siblings('option').remove();
	$sector.val(0);
	
	if ($modal.prop('sectors') == undefined){
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
					$modal.prop('sectors', data['sectors']);
					$.each($modal.prop('sectors'), function(i,v){
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
	} else {
	
		$.each($modal.prop('sectors'), function(i,v){
			$sector = $(target).find('select[name="sector"]');
			if ($sector.find('option[value="'+v.id+'"]').length<1)
					$sector.append($('<option>').val(v.id).text(v.fullname));
		});
	}

	// $ reset select
	$(target).find('form').get(0).reset();

	// $ reset old data
	
	// ^ populate new data

	if (id>0)
	{
		var msgs = $modal.prop('msgs');
		if (id in msgs){
			var msg = msgs[id];
			$(target).find('textarea[name="message"]').val(msg.message);
			$(target).find(':checkbox[name="warning"]').prop('checked', msg.warning);
			
			if (msg.sector!=null)
			{
				var $sector = $(target).find('select[name="sector"] option[value="'+msg.sector.id+'"]');
				if ($sector.length<1){
					$('#usersModal').find('select[name="sector"]')
						.append($('<option>').val(msg.sector.id).text(msg.sector.fullname));
				}
				$(target).find('select[name="sector"]').val(msg.sector.id);
			} else
				$(target).find('select[name="sector"]').val(0);

			$(target).find(':checkbox[name="broadcast"]').prop('checked', msg.broadcast);
			
		}else{
			toastr['error']
				('Non &egrave; stato possibile caricare l\'utente. Segnalare questo problema agli amministratori del servizio!');
		}
	}else{
		
	}
	// $ populate new data
}

function populateMsgs(data){
	$edit = $('<a></a>').attr('title','Modifica')
		.addClass('btn btn-sm btn-info').attr('data-show','#msgsEditor');
	$remove = $('<a></a>').attr('title','')
		.addClass('btn btn-sm btn-danger').attr('data-toggle','confirmation')
			.attr('data-original-title', 'Vuoi davvero cancellare questo messaggio in modo permanente?');
	$edit.html('<span class="glyphicon glyphicon-pencil"></span>');
	$remove.html('<span class="glyphicon glyphicon-trash"></span>');
	
	$.each(data, function(index, msg){
		var sector = msg.sector?msg.sector.fullname:'';
		var $editButton = $edit.clone().attr('data-id',msg.id);
		var $removeButton = $remove.clone().attr('data-id',msg.id);
		
		tableMsgs.row.add([
           $('<div>&nbsp;</div>').append($removeButton)
           		.prepend($editButton).html(),
           msg.message,		
           msg.broadcast?'<b>Tutti gli utenti!</b>':sector,
		   msg.warning?'Urgente':'Standard',
           msg.lastchange,
           escapeHtml(msg.author.fullname),
       ]);
	});
	
	tableMsgs.draw();
	$modal.find('a[data-toggle="confirmation"]').confirmation(confirmation_delete_msg_options);
}

function msgDelete(toastr, item)
{
	$.ajax({
		url:			msg_delete_url,
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
				$tr = $modal.find('a.btn-danger[data-id='+item.id+']').closest('tr');
				$tr.addClass('remove');
				tableMsgs.row('.remove').remove().draw( false );
			}
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
				toastr['error'] = 'Non è stato possibile rimuovere il messaggio. Riprovare più tardi.';
			},
	});
}