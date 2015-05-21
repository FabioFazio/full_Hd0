var shownMessages = {};
var loadCompleted = false;

function removeColors (index, css) {
    return (css.match (/(^|\s)bg-\S+/g) || []).join(' ');
}

function removeMetaColors (index, css) {
    return (css.match (/(^|\s)color-\S+/g) || []).join(' ');
}

function colorize($scope)
{
	var $target = $scope || $(document);
	$.each(palette, function (index, value){
		var $items = $target.find('.'+index);
		$items.removeClass(removeColors)
            .addClass(value);
	});
	return true;
}

function initHelp() // called from script.js
{
	$.each( ambitiApplicativiHelps, function(index, value){
		   $('#ambitiApplicativi span[data-toggle="tooltip"]').attr(index, value);
    });
	$.each( bozzeHelps, function(index, value){
		   $('#bozze span[data-toggle="tooltip"]').attr(index, value);
    });
	$.each( chiuseHelps, function(index, value){
		   $('#chiuse span[data-toggle="tooltip"]').attr(index, value);
	});
	$.each( legendaHelps, function(index, value){
		   $('#legenda span[data-toggle="tooltip"]').attr(index, value);
	});
}

function showMessages(messages)
{
	$.each(messages, function(index, value){
		if (!(value.id in shownMessages))
		{
			window.console&&console.log('Messaggio di bacheca: '+value.message);
			
			var options = $.extend(true, {}, toastr.options);
			toastr.options.hideDuration = "5000";
			toastr.options.progressBar = true;
			toastr.options.preventDuplicates = true;
			toastr.options.positionClass = "toast-bottom-full-width";	
			 
			if(value.warning)
				toastr["warning"](value.message);
			else
				toastr["info"](value.message);
			
			toastr.options = options;
			shownMessages[value.id] = value.message;
		}
	});
}

function updateTicket(v, $li){
	$li.attr('data-ticket-id', v['TicketID']);
	$li.find('*[data-name="Title"]').not('[data-prop]').empty().html(v['Title']);
	$li.find('*[data-name="ArticleNum"]').not('[data-prop]').empty().html(v['ArticleNum']);
	$li.find('.queue-color').removeClass(removeMetaColors).addClass(v['QueueColor']);
	$li.find('*[data-name="QueueName"][data-prop]').each(function(){
		$(this).prop($(this).data('prop'), $(this).prop($(this).data('prop')).split(':')[0] +': '+ v['QueueName']);});

	$li.find('*[data-name="Author"][data-prop]').each(function(){
		var author = v['Author']; 
		if(author === getUser().email)
		{
			author = getUser().name;
			$(this).parent('div').addClass('alert-warning');
		} else {
			$(this).parent('div').removeClass('alert-warning');
		}
		$(this).prop($(this).data('prop'), $(this).prop($(this).data('prop')).split(':')[0] +': '+ author);
	});
	
	var $button = $li.find('button[data-toggle]');
	$button.attr('data-service-id', v['ServiceId']);
	$button.attr('data-queue-id', v['QueueID']);
	$button.attr('data-queue-name', v['QueueName']);
	$button.attr('data-queue-color', v['QueueColor']);
	$button.attr('data-articles', v['ArticleNum']);
	$button.attr('data-id', v['TicketID']);
	$button.attr('data-num', v['TicketNumber']);
	$button.prop('data-ticket-title', v['Title']);
	$button.prop('data-ticket-desc', v['Article'][0]['Body']);
	
	var priorityId = parseInt(v['Article'][0]['PriorityID']) >= 4;
	$button.prop('data-ticket-priority', priorityId);
	if (priorityId)
	{
		$li.find('.tag-urgent').removeClass('hidden');
	}

	var stateId = parseInt(v['StateID']);
	switch (stateId) {
	case 1: //new
		break;
	case 2: //success
		$li.find('.badge.alert-danger').addClass('hidden');
		$li.find('.badge.alert-success').removeClass('hidden');
		break;
	case 3: //unsuccess
		$li.find('.badge.alert-success').addClass('hidden');
		$li.find('.badge.alert-danger').removeClass('hidden');
		break;
	case 6: //waiting
		$li.find('.tag-waiting').removeClass('hidden');
	default:
		$li.find('.tag-working').removeClass('hidden');
		$li.find('.badge.alert-success').addClass('hidden');
		$li.find('.badge.alert-danger').addClass('hidden');
	}
}

function populate(data){
    var bozze = [], chiuse = [];
    var $bozzeTicket = $('.bozze-ticket');    
    var $chiuseTicket = $('.chiuse-ticket');
    var $bozzeEmpty = $('#bozze_empty');
    var $chiuseEmpty = $('#chiuse_empty');
    
    if('messages' in data && data.messages.length)
    	showMessages(data['messages']);
    
    // generazione liste di visualizzazione
    $.each(bozzeStateIds, function(k,id){
        if(id in data) $.merge(bozze, data[id]);});
    $.each(chiuseStateIds, function(k,id){
        if(id in data) $.merge(chiuse, data[id]);});

    var func = function(a, b){
    	  var aTime = a['Changed'];
    	  var bTime = b['Changed']; 
    	  return ((aTime < bTime) ? -1 : ((aTime > bTime) ? 1 : 0));
    	};
    bozze.sort(func);
    chiuse.sort(func);

    if (bozze.length)
        $bozzeEmpty.addClass('hidden');
    else
        $bozzeEmpty.removeClass('hidden');
    if (chiuse.length)
        $chiuseEmpty.addClass('hidden');
    else
        $chiuseEmpty.removeClass('hidden');

    var $currentList = [];
	$.each(bozze, function(k,v){
    		var $li = $bozzeTicket.siblings("li[data-ticket-id='"+v['TicketID']+"']");
    		if ($li.length){
    			// update
    			updateTicket(v, $li);
    			$bozzeEmpty.after($li);
    		}else{
    			// create		  
		        $li = $bozzeTicket.clone();
		        $bozzeEmpty.after($li);
		        $li.removeClass('bozze-ticket');
		        $li.toggleClass('hidden');
		        updateTicket(v, $li);
    		}
    		$.merge($currentList,$li);
		});
	$bozzeTicket.siblings("li").not($currentList).not('#bozze_empty').remove();

    $currentList = [];
	$.each(chiuse, function(k,v){
    		var $li = $chiuseTicket.siblings("li[data-ticket-id='"+v['TicketID']+"']");
    		if ($li.length){
    			// update
    			updateTicket(v, $li);
    			$chiuseEmpty.after($li);
    		}else{
    			// create		  
		        $li = $chiuseTicket.clone();
		        $chiuseEmpty.after($li);
		        $li.removeClass('chiuse-ticket');
		        $li.toggleClass('hidden');
		        updateTicket(v, $li);
    		}
    		$.merge($currentList,$li);
		});
	$chiuseTicket.siblings("li").not($currentList).not('#chiuse_empty').remove();
	
	updateCounters(bozze, chiuse);
}

function updateCounters(b, c)
{
	var bozze = (typeof b !== 'undefined')? b :[];
	var chiuse = (typeof c !== 'undefined')? c :[];
	
	if (!loadCompleted){
		loadCompleted = true;
		return;
	}
			
	var counters = {};
    // aggiornamento contatori
    $.each(bozze, function(k,v){
    		var id = 'q'+v['QueueOrder']+'_bozze';
    		var tot = 'tot_bozze';
    		counters[id] = (id in counters)?counters[id]+1:1;
    		counters[tot] = (tot in counters)?counters[tot]+1:1;
		});
    $.each(chiuse, function(k,v){
			var id = 'q'+v['QueueOrder']+'_chiuse';
			var tot = 'tot_chiuse';
			counters[id] = (id in counters)?counters[id]+1:1;
			counters[tot] = (tot in counters)?counters[tot]+1:1;
		});

	$('[data-name="counter"]').text(0);
    $.each(counters, function(k,v){
    	$('#'+k).text(v+"");
    });
}

function updateCategory (q, $categoria){
	$categoria
		.attr('id', 'q'+q['order'])
		.removeClass('color-?')
		.addClass('color-'+q['order']);
	
	$categoria.find('p[data-name="name"]')
	   .text(q['name']);
	$categoria.find('#qN_bozze')
	   .attr('id', 'q'+q['order']+'_bozze');
	$categoria.find('#qN_chiuse')
	   .attr('id', 'q'+q['order']+'_chiuse');
	
	var $button = $categoria.find('button[data-toggle]');
	$button
		.attr('data-service-id', q['service_id'])
		.attr('data-queue-id', q['id'])
		.attr('data-queue-name', q['name'])
		.attr('data-queue-color', 'color-'+q['order']);
	
	if (q['filters']){
		$button
			.attr('data-target', '#filterModal')
			.prop('data-filters', q['filters']);
	}else{
		$button.attr('data-target', '#ticketModal');
	}
	
	return $categoria;
}

function prepare(categories, $target){
    var $cat = $target.find('.mock');
    if (categories.length){
    	$target.find('#cat_empty').addClass('hidden');
    }else{
    	$target.find('#cat_empty').removeClass('hidden');
	}
	$.each(categories, function(k,c){
		// create		  
        var $clone = $cat.clone().removeClass('mock').removeClass('hidden');
        $target.append(updateCategory(c, $clone));
	});
	
	updateCounters();
}

function content(){
	var user = getUser();
	if (user && user.email)
	{
		var $catList = $('#catList');
		if (!$catList.find('li.mock').siblings().not('#cat_empty').length){
			$.ajax({
				url:			category_url,
				type:			"POST",
				datatype:		"json",
				data:{
					username:		user.username,
					email:			user.email,
					queues:			getQueues(),
				},
				async: true,
				success: function(data, status) {
					window.console&&console.log(data); // for debugging
					prepare(data, $catList);
					colorize();
				},
				error: function(data, status) { window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>'); },
			});
		}
		$.ajax({
			url:			ticket_url,
			type:			"POST",
			datatype:		"json",
			data:{
				username:		user.username,
				email:			user.email,
				queues:			getQueues(),
			},
			async: true, // default true
			success: function(data, status) {
				window.console&&console.log(data); // for debugging
				populate(data);
				colorize();
			},
			error: function(data, status) { window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>'); },
		});
	}	
}
