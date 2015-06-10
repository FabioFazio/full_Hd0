// Extra actions on successfull submit
fallbackForm['filterForm'] =
	function fallback (data, status, $msgBox, $form) {
		$.each(data, function(i, msg){
			if($.inArray(i,['success','error','warning','info'])>=0){
				toastr[i](msg);
			}
		});
		if (!('error' in data)){
			filtersLoad();
			$form.find('button[data-hide]').first().trigger('click');
		}
	};

/* Library for filters.inc */
function filtersInit()
{
	$modal.find('div.modal-xl').css( "width", $(window).innerWidth()-50 );
	tableFilters = tableFilters?tableFilters:$('#filters').dataTable(table_filters_options).api();
	
	// ^ editor animation
    $modal.on('click', '[data-show="#filtersEditor"]', function(){
		var target = $(this).attr('data-show');
		var twin = $(target).attr('data-flip');
		filterEditorInit(target, $(this).attr('data-id'));
		if ($(target).hasClass('hidden')){
			$(target).add(twin).toggleClass('hidden');
		}
	});
	
    $modal.on('click', '[data-hide]', function(){
		var target = $(this).attr('data-hide');
		var twin = $(target).attr('data-flip');
		$(target).add(twin).toggleClass('hidden');
	});
	// $ editor animation
}

function filtersLoad(e)
{
	//var refresh = (typeof e !== 'undefined')?true:false;
	
	// ^ clean old data
	tableFilters.rows().remove();
	tableFilters.draw();
	// $ clean old data

	$.ajax({
		url:			filters_url,
		type:			"POST",
		datatype:		"json",
		data:{
			secret:			getUser().password
		},
		async: true,
		success: function(data, status) {
			window.console&&console.log(data); // for debugging
			populateFilters(data['filters']);
			$modal.prop('filters', data['filters']);
			$modal.prop('queues', data['queues']);
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
			},
	});
	
		// ^ form interface depending by type selected

	$modal.on ('change', 'select[name="type"]', function(){
		
		var val = $(this).val();
		var id = parseInt($modal.find('input[name="id"]').val());
		var arrayParents = $modal.find('input[name="ids"]').val().split(".");
		
		switch (parseInt(val)) {
		case 0:
			// DEFAULT>> hide: question, #responces, responce, disable save
			
			$modal.find('[name="question"]').parent('div').addClass('hidden');
			$modal.find('[name="responce"]').parent('div').addClass('hidden');
			$modal.find('#responces').parent('div').addClass('hidden');
			
			$modal.find('button[type="submit"]').attr('disabled','disabled');
			break;
		case 1:
			// FILTER>> show: responce se has father, question, set #questionLabel = 'Domanda', if parent>0? show responce, node=true
			
			$modal.find('[name="question"]')
				.removeAttr('disabled').attr('placeholder', 'Domanda per identificare la tipologia della segnalazione')
				.parent('div').removeClass('hidden');
			$modal.find('#questionLabel').text('Domanda');
			
			if (arrayParents[0]!="0"){ // has a father
				$modal.find('[name="responce"]')
					.removeAttr('disabled').parent('div').removeClass('hidden');
 			} else {
				$modal.find('[name="responce"]')
					.attr('disabled','disabled').parent('div').addClass('hidden');
 			}
			
			if (id>0) { // is not new
				$modal.find('#responces').parent('div').removeClass('hidden');
			}else{
				$modal.find('#responces').parent('div').addClass('hidden');
			}
		
			$modal.find('input[name="node"]').val(1);
			$modal.find('button[type="submit"]').removeAttr('disabled');
			break;
		case 2:
			// OPEN>> hide: responces, question, if parent>0? show responce, node=false
			
			$modal.find('#responces').parent('div').addClass('hidden');
			
			$modal.find('[name="question"]').attr('disabled','disabled').parent('div').addClass('hidden');
			
			if (arrayParents[0]!="0"){ // has a father
				$modal.find('[name="responce"]')
					.removeAttr('disabled').parent('div').removeClass('hidden');
 			} else {
				$modal.find('[name="responce"]')
					.attr('disabled','disabled').parent('div').addClass('hidden');
 			}
			
			$modal.find('input[name="node"]').val(0);
			$modal.find('button[type="submit"]').removeAttr('disabled');
			break;
		case 3:
			// LOCK>> hide: responces, show: question, set #questionLabel = 'Motivazione', if parent>0? show responce, node=false

			$modal.find('#responces').parent('div').addClass('hidden');
			
			$modal.find('[name="question"]')
				.removeAttr('disabled').attr('placeholder', 'Inibita la nuova segnalazione perchè...')
				.parent('div').removeClass('hidden');
			$modal.find('#questionLabel').text('Motivazione');
			
			if (arrayParents[0]!="0"){ // has a father
				$modal.find('[name="responce"]')
					.removeAttr('disabled').parent('div').removeClass('hidden');
 			} else {
				$modal.find('[name="responce"]')
					.attr('disabled','disabled').parent('div').addClass('hidden');
 			}
			
			$modal.find('input[name="node"]').val(0);
			$modal.find('button[type="submit"]').removeAttr('disabled');
			break;
		}
	});
	
	// $ form interface depending by type selected
	
	
	// type depending visibility: , hide: responce, question, #responces
}

function filterEditorInit(target, dataId)
{

	// ^ reset old data
	
	// load items
	var ids = dataId;
	
	var arrayParents = ids.split(".");
	var id = arrayParents.pop();
	var fatherId = 0;
	if(arrayParents.length){
		fatherId = arrayParents[arrayParents.length-1];
		ids = arrayParents.join('.'); 
	} else
		ids = 0;
	
	
	var filters = $modal.prop('filters');
	var family = [];
	var item = null;
	
	$.each(dataId.split("."), function(i,id){
		if (id in filters){
			item = filters[id];
			family.push(item);
			if (typeof(item['responces']) !== 'undefined' && $.map(item['responces'], function(n, i) { return i; }).length)
				filters = item['responces'];
			else
				return;
		} else {
			item = null;
			family.push(item);
			return
		}
	});

	$(target).find('input').val('');
	$(target).find('input[name="id"]').val(id);
	$(target).find('input[name="ids"]').val(ids);
	$(target).find('input[name="secret"]').val(getUser().password);
	$(target).find('button[data-id]').attr('data-id', dataId+'.0');
	
	// ^ reset queue
	var $queue = $(target).find('select[name="queue"]');
	$queue.find('option[value="0"]').siblings('option').remove();
	$queue.val(0);
	
	var queues = {};

	var used = [];
	$.each($modal.prop('filters'), function(i, f){
		used.push(f['queue_id']);
	});
	
	$.each($modal.prop('queues'), function(i, q) {
			if ($.inArray(parseInt(i), used) < 0){
				queues[i] = q;
			}
		}
	);
	
	$.each(queues, function(i,v){
		if ($queue.find('option[value="'+v.id+'"]').length<1)
				$queue.append($('<option>').val(i).text(v));
	});
	
	// $ reset select
	
	$(target).find('select[name="type"]').val(0);
	
	$(target).find('form').get(0).reset();

	// $ reset old data
	
	// ^ populate new data
	
	if (id>0)
	{
		// queue populated & disabled, type populated (if node? filter else if (quest="") open else close) and disabled
		
		if (item) // edit!
		{
			// ^ populate #responces
			var $sons = $(target).find('table#responces tbody');
			var $edit = $('<a></a>').attr('title','Modifica')
				.addClass('btn btn-sm btn-info').attr('data-show','#filtersEditor');
			var $remove = $('<a></a>').attr('title','')
					.addClass('btn btn-sm btn-danger')
					.attr('data-toggle','confirmation')
					.attr('data-original-title', 'Vuoi davvero cancellare questo elemento?');
			$edit.html('<span class="glyphicon glyphicon-pencil"></span>');
			$remove.html('<span class="glyphicon glyphicon-trash"></span>');
			$sons.empty();
			$.each(item.responces, function(i,v){
				
				var $editButton = $edit.clone().attr('data-id',dataId+'.'+v.id);
				var $removeButton = $remove.clone().attr('data-id',dataId+'.'+v.id);
				var risposta = v.responce;
				var azione =	'';
				if(typeof(v.question)!=='undefined' && v.question!==null && !v.node){
					azione = 'Inibisci la Segnalazione';
				}else if(v.node){
					azione = 'Domanda all\'Utente';
				}else{
					azione = 'Apri la Segnalazione';
				}
				
				var $tools = $('<div>&nbsp;</div>').append($removeButton).prepend($editButton);
				var $tr = $('<tr>')
						.append($('<td>').html($tools.html()))
						.append($('<td>').html(risposta))
						.append($('<td>').html(azione));
				$sons.append($tr.clone());
				
			});
			if ($sons.find('tr').length<1)
				$sons.append('<tr><td colspan="3"><em>Vuoto</em></td></tr>');
			else
				$sons.find('a[data-toggle="confirmation"]').confirmation(confirmation_delete_filter_options);

			// $ populate #responces
			
			if (!fatherId)
			{
				// hide: prevQuestion & responce
				$(target).find('input[name="prevQuestion"]').parent('div').addClass('hidden');
				$(target).find('input[name="responce"]').parent('div').addClass('hidden');
			}
			else
			{
				// populate & show prevQuestion & responce
				$(target).find('input[name="prevQuestion"]').parent('div').removeClass('hidden');
				var father = family[family.length-2];
				$(target).find('input[name="prevQuestion"]')
					.val(unescapeHtml(father.question)).parent('div').removeClass('hidden');
				
				$(target).find('input[name="responce"]')
					.val(unescapeHtml(item.responce)).parent('div').removeClass('hidden');
			}

			// populate queue
			var $select = $(target).find('select[name="queue"]');
			var $queue = $select.find('option[value="'+family[0].queue_id+'"]');
			if ($queue.length<1){
				$select
					.append($('<option>').val(family[0].queue_id).text(family[0].queue_name));
			}
			$select.val(family[0].queue_id);
			// disabled queue if editing
			$select.attr('disabled', 'disabled');
			
			// populate node
			$(target).find('input[name="node"]').val(item.node);
			// populate and show question
			$(target).find('input[name="question"]').val(unescapeHtml(item.question))
				.parent('div').removeClass('hidden');
			
			var $type = $(target).find('select[name="type"]');
			if (item.node){
				$type.val(1).trigger('change').attr('disabled','disabled').parent('div').removeClass('hidden');
			}else if (typeof(item.question) !== 'undefined' && item.question != null && item.question.length>0){
				$type.val(3).trigger('change').attr('disabled','disabled').parent('div').removeClass('hidden');
			}else{
				$type.val(2).trigger('change').attr('disabled','disabled').parent('div').removeClass('hidden');
			}
			

		} else {
			toastr['error']
				('Non &egrave; stato possibile caricare l\' elemento. Segnalare questo problema agli amministratori del servizio!');
		
		}
	}else{ // new!
		// hide: responce, question, #responces
		$(target).find('input[name="responce"]').parent('div').addClass('hidden');
		$(target).find('input[name="question"]').parent('div').addClass('hidden');
		$(target).find('#responces').parent('div').addClass('hidden');
		
		if (!fatherId)
		{
			// type fixed to 1, queue selectable, hide: prevQuestion
			// ^ reset type
			var $type = $(target).find('select[name="type"]');
			$type.val(1).trigger('change');
			$type.parent('div').addClass('hidden');
			// $ reset type
			
			$(target).find('select[name="queue"]').removeAttr('disabled');
			$(target).find('[name="prevQuestion"]').parent('div').addClass('hidden');
			
		} else {
			// type reset and selectable, queue populated and disabled, populate and disabled prevPuestion

			// populate queue and disable it
			var $select = $(target).find('select[name="queue"]');
			var $queue = $select.find('option[value="'+family[0].queue_id+'"]');
			if ($queue.length<1){
				$select
					.append($('<option>').val(family[0].queue_id).text(family[0].queue_name));
			}
			$select.val(family[0].queue_id);
			// disabled queue if a new son
			$select.attr('disabled', 'disabled');
			
			var $select = $(target).find('select[name="queue"]');
			$select.val(family[0].queue_id).attr('disabled','disable').parent('div').removeClass('hidden');
			
			// populate & show prevQuestion
			$(target).find('input[name="prevQuestion"]').parent('div').removeClass('hidden');
			var father = family[family.length-2];
			$(target).find('input[name="prevQuestion"]')
				.val(unescapeHtml(father.question)).parent('div').removeClass('hidden');
			
			// ^ reset type
			var $type = $(target).find('select[name="type"]');
			$type.val(0).trigger('change');
			$type.removeAttr('disabled').parent('div').removeClass('hidden');
			// $ reset type			
		}
	}
	
	// $ populate new data
	
}

function populateFilters(data)
{
	$edit = $('<a></a>').attr('title','Modifica')
		.addClass('btn btn-sm btn-info').attr('data-show','#filtersEditor');
	$remove = $('<a></a>').attr('title','')
		.addClass('btn btn-sm btn-danger').attr('data-toggle','confirmation').
		attr('data-original-title', 'Vuoi davvero cancellare questo filtro in modo permanente?');
	$edit.html('<span class="glyphicon glyphicon-pencil"></span>');
	$remove.html('<span class="glyphicon glyphicon-trash"></span>');
	$.each(data, function(index, filter){
		var $editButton = $edit.clone().attr('data-id',filter.id);
		var $removeButton = $remove.clone().attr('data-id',filter.id);
		
		var counter = $.map(filter.responces, function(n, i) { return i; }).length;
		var choices = (counter || filter.node)? '<span class="text-info">'+counter+'</span>' :
						(filter.question)? '<span class="text-danger">Non &egrave; possibile aprire il ticket<span>' :
							'<span class="text-success">Il ticket verr&agrave; aperto</span>';
		var message = escapeHtml(filter.question?filter.question:'<non definito>');
		tableFilters.row.add([
           $('<div>&nbsp;</div>').append($removeButton)
           		.prepend($editButton).html(),
       	   escapeHtml(filter.queue_name),
           message,
           choices,
       ]);
	});
	
	tableFilters.draw();
	$('a[data-toggle="confirmation"]').confirmation(confirmation_delete_filter_options);
}

function filterDelete(toastr, item)
{
	$.ajax({
		url:			filter_delete_url,
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
				
				if (item.queue_id){
					// is a root filter so update table and tree
					$tr = $('#filters').find('a.btn-danger[data-id='+item.id+']').closest('tr');
					$tr.addClass('remove');
					var fs = $modal.prop('filters');
					delete fs[item.id];
					$modal.prop('filters', fs);
				}else{
					// is not a root filter so update table and tree
					filtersLoad();
					$tr = $('#responces').find('a.btn-danger[data-id="'+item.id+'"]').closest('tr');
					$tbody = $tr.closest('table tbody');
					$tr.remove();
					if ($tbody.find('tr').length<1)
						$tbody.append('<tr><td colspan="3"><em>Vuoto</em></td></tr>');
				}
				
				tableFilters.row('.remove').remove().draw( false );
				
			}
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
				toastr['error'] = 'Non è stato possibile rimuovere l\' elemento. Riprovare più tardi.';
			},
	});
}