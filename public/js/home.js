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

function updateTicket(v, $li){
	$li.attr('data-ticket-id', v['TicketID']);
	$li.find('*[data-name="Title"]').not('[data-prop]').empty().html(v['Title']);
	$li.find('*[data-name="ArticleNum"]').not('[data-prop]').empty().html(v['ArticleNum']);
	$li.find('.queue-color').removeClass(removeMetaColors).addClass(v['QueueColor']);
	$li.find('*[data-name="QueueName"][data-prop]').each(function(){
		$(this).prop($(this).data('prop'), v['QueueName']);});

	var $button = $li.find('button[data-toggle]');
	$button.attr('data-service-id', v['ServiceId']);
	$button.attr('data-queue-id', v['QueueID']);
	$button.attr('data-queue-name', v['QueueName']);
	$button.attr('data-queue-color', v['QueueColor']);
	$button.attr('data-articles', v['ArticleNum']);
	$button.attr('data-id', v['TicketID']);
	$button.prop('data-ticket-priority', parseInt(v['Article'][0]['PriorityID']) >= 4);
	$button.prop('data-ticket-title', v['Title']);
	$button.prop('data-ticket-desc', v['Article'][0]['Body']);

	var stateId = parseInt(v['StateID']);
	if( stateId == 2 ){
		$li.find('.badge.alert-success').removeClass('hidden');
	}else{
		$li.find('.badge.alert-success').addClass('hidden');
	}
}

function populate(data){
    var bozze = [], chiuse = [];
    var $bozzeTicket = $('.bozze-ticket');    
    var $chiuseTicket = $('.chiuse-ticket');
    var $bozzeEmpty = $('#bozze_empty');
    var $chiuseEmpty = $('#chiuse_empty');
    
    var counters = {};

    // generazione liste di visualizzazione
    $.each(bozzeStateIds, function(k,id){
        if(id in data) $.merge(bozze, data[id]);});
    $.each(chiuseStateIds, function(k,id){
        if(id in data) $.merge(chiuse, data[id]);});

    var func = function(a, b){
    	  var aTime = a['Changed'];
    	  var bTime = b['Changed']; 
    	  return ((aTime < bTime) ? -1 : ((aTime > bTime) ? 1 : 0));
    	}
    bozze.sort(func);
    chiuse.sort(func);
    
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
    // reset
	$('[data-name="counter"]').text(0);
    $.each(counters, function(k,v){
    	$('#'+k).text(v+"");});
    
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
}

function content(){
	if ($('#auth_email').length && $('#auth_email').val().length)
	{
	$.ajax({
		url:			content_url,
		type:			"POST",
		datatype:		"json",
		data:{
			unsername:		$('#auth_username').val(),
		},
		async: true, // default true
		success: function(data, status) {
			console.log(data); // for debugging
			populate(data);
			colorize();
		},
		error: function(data, status) { console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>'); },
		});
	}	
}