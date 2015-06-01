// Extra actions on successfull submit
fallbackForm['storeForm'] = fallbackForm['departmentForm'] = fallbackForm['sectorForm'] =
	function fallback (data, status, $msgBox, $form) {
		$.each(data, function(i, msg){
			if($.inArray(i,['success','error','warning','info'])>=0){
				toastr[i](msg);
			}
		});
		if (!('error' in data)){
			storesLoad();
		}
	};

/* Library for stores.inc */
function storesInit()
{
	var $modal = $( '#storesModal' ); 
	$modal.find('div.modal-xl').css( "width", $(window).innerWidth()-50 );
    tableStores = tableStores?tableStores:$('#stores').dataTable(table_stores_options).api();
	
	// ^ editor animation
    $modal.on('click', '[data-show="#sectorsEditor"]', function(){
		var target = $(this).attr('data-show');
		var twin = $(target).attr('data-flip');
		sectorEditorInit(target, this);
		$(target).add(twin).toggleClass('hidden');
	});
    
    $modal.on('click', '[data-show="#departmentsEditor"]', function(){
		var target = $(this).attr('data-show');
		var twin = $(target).attr('data-flip');
		departmentEditorInit(target, this);
		$(target).add(twin).toggleClass('hidden');
	});
    
    $modal.on('click', '[data-show="#storesEditor"]', function(){
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
		url:			stores_url,
		type:			"POST",
		datatype:		"json",
		data:{
			secret:			getUser().password
		},
		async: true,
		success: function(data, status) {
			window.console&&console.log(data); // for debugging
			populateStores(data['stores']);
			$( '#storesModal' ).prop('stores', data['stores']);
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
			},
	});
}

function secotorEditorInit(target, button){

}

function departmentEditorInit(target, button){
	// ^ reset old data
	var ids = $(button).attr('data-id');
	var parent = ids.split(".")[0];
	var id = ids.split(".")[1];

	$(target).find('input').val('');
	$(target).find('input[name="id"]').val(id);
	$(target).find('input[name="secret"]').val(getUser().password);
	
	// ^ reset sons
	
	$(target).find('table#sectors tbody tr').remove();
	
	// $ reset sons
	
	// ^ reset manager
	var $manager = $(target).find('select[name="manager"]');
	$manager.find('option[value="0"]').siblings('option').remove();
	$manager.val(0);
	
	if ($( '#storesModal' ).prop('managers') == undefined){
		$.ajax({
			url:			users_url+'?short=1',
			type:			"POST",
			datatype:		"json",
			data:{
				secret:			getUser().password,
			},
			async: true,
			success: function(data, status) {
				window.console&&console.log(data); // for debugging
				$.each(data, function(i, msg){
					if($.inArray(i,['success','error','warning','info'])>=0){
						toastr[i](msg);
					}
				});
				if (!('error' in data) && ('users' in data)){
					$( '#storesModal' ).prop('managers', data['users']);
				}
			},
			error: function(data, status) {
					window.console&&console.log('<ajaxConsole ERROR> '+data+' </ajaxConsole ERROR>');
				},
		});
	}

	$.each($( '#storesModal' ).prop('managers'), function(i,v){
		$manager = $(target).find('select[name="manager"]');
		if ($manager.find('option[value="'+v.id+'"]').length<1)
				$manager.append($('<option>').val(v.id).text(v.fullname));
	});

	
	// $ reset select
	
	$(target).find('form').get(0).reset();

	// $ reset old data
	
	// ^ populate new data

	if (id>0)
	{
		var stores = $( '#storesModal' ).prop('stores');
		
		if (parent in stores &&
				stores[parent].departments != [] &&
				id in stores[parent].departments){
			var store = stores[parent];
			var department = store.departments[id];
			$(target).find('input[name="name"]').val(department.name);
			
			var $select = $(target).find('select[name="manager"]');
			if (department.manager_id)
			{
				var $manager = $select.find('option[value="'+department.manager_id+'"]');
				if ($manager.length<1){
					$select
						.append($('<option>').val(department.manager_id).text(department.manager));
				}
				$select.val(department.manager_id);
			} else
				$select.val(0);
			
			var $sons = $(target).find('table#sectors tbody');
			
			var $edit = $('<a></a>').attr('title','Modifica')
				.addClass('btn btn-sm btn-info').attr('data-show','#sectorsEditor');
			var $remove = $('<a></a>').attr('title','')
					.addClass('btn btn-sm btn-danger')
					.attr('data-toggle','confirmation')
					.attr('data-original-title', 'Vuoi davvero cancellare questo settore?');
			$edit.html('<span class="glyphicon glyphicon-pencil"></span>');
			$remove.html('<span class="glyphicon glyphicon-trash"></span>');
			
			$.each(department.sectors, function(i,v){
				
				var $editButton = $edit.clone().attr('data-id',ids+'.'+v.id);
				var $removeButton = $remove.clone().attr('data-id',ids+'.'+v.id);
				
				var $tools = $('<div>&nbsp;</div>').append($removeButton).prepend($editButton);
				var $tr = $('<tr>')
						.append($('<td>').html($tools.html()))
						.append($('<td>').text(v.name))
						.append($('<td>').text(v.manager));
				$sons.append($tr.clone());
				
			});
			
			$(target).find('button[data-show="#sectorsEditor"]').attr('data-id',ids+'.0');
			$(target).find('#sectors').parent('div').removeClass('hidden');

		}else{
			toastr['error']
				('Non &egrave; stato possibile caricare l\' elemento. Segnalare questo problema agli amministratori del servizio!');
		}
	}else{
		$(target).find('#sectors').parent('div').addClass('hidden');
	}
	
	if ($(target).find('table#sectors tbody tr').length<1)
		$(target).find('table#sectors tbody')
			.append('<tr><td colspan="4"><em>Vuoto</em></td></tr>');
	else
		$(target).find('a[data-toggle="confirmation"]').confirmation(confirmation_delete_sector_options);
	
	// $ populate new data

}

function storeEditorInit(target, button){
	// ^ reset old data
	var id = $(button).attr('data-id');

	$(target).find('input').val('');
	$(target).find('input[name="id"]').val(id);
	$(target).find('input[name="secret"]').val(getUser().password);
	
	// ^ reset sons
	
	$(target).find('table#departments tbody tr').remove();
	
	//$(target).find('table#sectors tbody tr').remove();
	
	
	// $ reset sons
	
	// ^ reset manager
	var $manager = $(target).find('select[name="manager"]');
	$manager.find('option[value="0"]').siblings('option').remove();
	$manager.val(0);
	
	if ($( '#storesModal' ).prop('managers') == undefined){
		$.ajax({
			url:			users_url+'?short=1',
			type:			"POST",
			datatype:		"json",
			data:{
				secret:			getUser().password,
			},
			async: true,
			success: function(data, status) {
				window.console&&console.log(data); // for debugging
				$.each(data, function(i, msg){
					if($.inArray(i,['success','error','warning','info'])>=0){
						toastr[i](msg);
					}
				});
				if (!('error' in data) && ('users' in data)){
					$.each(data['users'], function(i,v){
						$manager = $(target).find('select[name="manager"]');
						if ($manager.find('option[value="'+v.id+'"]').length<1)
							$manager.append($('<option>').val(v.id).text(v.fullname));
					});
					$( '#storesModal' ).prop('managers', data['users']);
				}
			},
			error: function(data, status) {
					window.console&&console.log('<ajaxConsole ERROR> '+data+' </ajaxConsole ERROR>');
				},
		});
	} else {
		$.each($( '#storesModal' ).prop('managers'), function(i,v){
			$manager = $(target).find('select[name="manager"]');
			if ($manager.find('option[value="'+v.id+'"]').length<1)
					$manager.append($('<option>').val(v.id).text(v.fullname));
		});
	}
	
	// $ reset select
	
	$(target).find('form').get(0).reset();

	// $ reset old data
	
	// ^ populate new data

	if (id>0)
	{
		var stores = $( '#storesModal' ).prop('stores');
		if (id in stores){
			var store = stores[id];
			$(target).find('input[name="name"]').val(store.name);
			$(target).find('input[name="address"]').val(store.address);
			
			var $select = $(target).find('select[name="manager"]');
			if (store.manager_id)
			{
				var $manager = $select.find('option[value="'+store.manager_id+'"]');
				if ($manager.length<1){
					$select
						.append($('<option>').val(store.manager_id).text(store.manager));
				}
				$select.val(store.manager_id);
			} else
				$select.val(0);
			
			var $sons = $(target).find('table#departments tbody');
			
			var $edit = $('<a></a>').attr('title','Modifica')
				.addClass('btn btn-sm btn-info').attr('data-show','#departmentsEditor');
			var $remove = $('<a></a>').attr('title','')
					.addClass('btn btn-sm btn-danger')
					.attr('data-toggle','confirmation')
					.attr('data-original-title', 'Vuoi davvero cancellare questo dipartimento con tutti i suoi settori?');
			$edit.html('<span class="glyphicon glyphicon-pencil"></span>');
			$remove.html('<span class="glyphicon glyphicon-trash"></span>');
			
			$.each(store.departments, function(i,v){
				
				var $editButton = $edit.clone().attr('data-id', id+'.'+v.id);
				var $removeButton = $remove.clone().attr('data-id', id+'.'+v.id);
				
				var $tools = $('<div>&nbsp;</div>').append($removeButton).prepend($editButton);
				var $tr = $('<tr>')
						.append($('<td>').html($tools.html()))
						.append($('<td>').text(v.name))
						.append($('<td>').text(v.manager))
						.append($('<td>').text($.map(v.sectors, function(n, i) { return i; }).length));
				$sons.append($tr.clone());
			});
			
			$(target).find('button[data-show="#departmentsEditor"]').attr('data-id',id+'.0');
			$(target).find('#departments').parent('div').removeClass('hidden');

		}else{
			toastr['error']
				('Non &egrave; stato possibile caricare l\' elemento. Segnalare questo problema agli amministratori del servizio!');
		}
	}else{
		$(target).find('#departments').parent('div').addClass('hidden');
	}
	
	if ($(target).find('table#departments tbody tr').length<1)
		$(target).find('table#departments tbody')
			.append('<tr><td colspan="4"><em>Vuoto</em></td></tr>');
	else
		$(target).find('a[data-toggle="confirmation"]').confirmation(confirmation_delete_department_options);	
	// $ populate new data

}

function populateStores(data)
{
	$edit = $('<a></a>').attr('title','Modifica')
		.addClass('btn btn-sm btn-info').attr('data-show','#storesEditor');
	$remove = $('<a></a>').attr('title','')
		.addClass('btn btn-sm btn-danger').attr('data-toggle','confirmation').
		attr('data-original-title', 'Vuoi davvero cancellare questo punto vendita con tutti i suoi dipartimenti e settori in modo permanente?');
	$edit.html('<span class="glyphicon glyphicon-pencil"></span>');
	$remove.html('<span class="glyphicon glyphicon-trash"></span>');
	$.each(data, function(index, store){
		var $editButton = $edit.clone().attr('data-id',store.id);
		var $removeButton = $remove.clone().attr('data-id',store.id);
		
		tableStores.row.add([
           $('<div>&nbsp;</div>').append($removeButton)
           		.prepend($editButton).html(),
           store.name,
           escapeHtml(store.address),
           escapeHtml(store.manager),
           $('<div>').append($('<span>').text($.map(store.departments, function(n, i) { return i; }).length)).html(),
       ]);
	});
	
	tableStores.draw();
	$('a[data-toggle="confirmation"]').confirmation(confirmation_delete_store_options);
}

function storeDelete(toastr, item)
{
	$.ajax({
		url:			store_delete_url,
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
				$tr = $('#stores').find('a.btn-danger[data-id='+item.id+']').closest('tr');
				$tr.addClass('remove');
				tableStores.row('.remove').remove().draw( false );
			}
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
				toastr['error'] = 'Non è stato possibile rimuovere l\' elemento. Riprovare più tardi.';
			},
	});
}

function departmentDelete(toastr, item)
{
	$.ajax({
		url:			department_delete_url,
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
				$tr = $('#departments').find('a.btn-danger[data-id='+item.id+']').closest('tr');
				$tr.remove();
			}
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
				toastr['error'] = 'Non è stato possibile rimuovere l\' elemento. Riprovare più tardi.';
			},
	});
}

function sectorDelete(toastr, item)
{
	$.ajax({
		url:			sector_delete_url,
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
				$tr = $('#sectors').find('a.btn-danger[data-id='+item.id+']').closest('tr');
				$tr.remove();
			}
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
				toastr['error'] = 'Non è stato possibile rimuovere l\' elemento. Riprovare più tardi.';
			},
	});
}