// mock
var mockFilters =
{
		id: 1, responce: null, 
        question: 'Da quale dispositivo hai acceduto al servizio?',
        responces: [{
        		id: 2, responce: 'PC',
            	question: 'Che browser hai utilizzato per accedere al servizio?',
            	responces: [{
            			id: 6, responce: 'Internet Explorer',
						question: null,
						responces: []
					},{
						id: 7, responce: 'Firefox',
						question: null,
						responces: []
					},{
						id: 8, responce: 'Chrome',
						question: null,
						responces: []
					},{
						id: 9, responce: 'Altro',
						question: null,
						responces: []
				}]
            },{
            	id: 3, responce: 'Tablet',
            	question: null,
            	responces: []
            },{
        		id: 4, responce: 'Smartphone',
            	question: 'Che modello di smarphone hai utilizzato per accedere al servizio?',
            	responces: [{
            			id: 10, responce: 'Android',
						question: null,
						responces: []
					},{
						id: 11, responce: 'IPhone',
						question: null,
						responces: []
					},{
						id: 12, responce: 'Windows Mobile',
						question: null,
						responces: []
					},{
						id: 13, responce: 'Altro',
						question: null,
						responces: []
				}]
            },{
            	id: 5, responce: 'Altro',
            	question: 'In che momento si &egrave; riscontrato il problema?',
            	responces: [{
            			id: 14, responce: 'Accesso al servizio',
						question: null,
						responces: []
					},{
						id: 15, responce: 'Gestione delle utenze',
						question: null,
						responces: []
					},{
						id: 16, responce: 'Finalizzazione di una stampa',
						question: null,
						responces: []
					},{
						id: 17, responce: 'Altro',
						question: null,
						responces: []
				}]
        }]
};
// end mock

var continueText = 'Per procedere premere il tasto di creazione in basso a destra.';

function onShowFilterModal (e)
{
	var $related = $(e.relatedTarget);
    var $current = $(e.currentTarget);

    var assignments = { // true: attr false: prop
    		"service-id"     :   true,
			"queue-id"       :   true,
			"queue-name"     :   true,
			"queue-color"    :   true,
			"id"             :   true,
			"num"            :   true,
			"articles"       :   true,
			"ticket-priority":   false,
			"ticket-title"   :   false,
			"ticket-desc"    :   false,
			"filters"		 :   false,
			//"taxonomie"		 :   false,
	};
    
    $.each(assignments, function(index, attr){

        var data = (attr)?$related.data(index):$related.prop('data-'+index);
        var $item = $current.find('#ticketLaucher');
        
        if (attr)
        	$item.attr('data-'+index, data);
        else
        	$item.prop('data-'+index, data);
    });
    
    var filters = $related.prop('data-filters');
    //var taxonomie = $related.prop('data-taxonomie');
    
    populateSteps($current, filters);
    
	/////////////////////////////////////////////
	/////////////// __WIZARD__ //////////////////
	/////////////////////////////////////////////    
    
    $('#rootwizard').bootstrapWizard(
    		{
    			onTabShow: function(tab, navigation, index) {
    					// Stato di avanzamento
						var $total = navigation.find('li').length;
						var $current = index+1;
						var $percent = ($current/$total) * 100;
						$('#rootwizard').find('.bar').css({width:$percent+'%'});
						if ($percent == 100)
							$('#rootwizard').find('.bar').addClass('progress-bar-success');
						else
							$('#rootwizard').find('.bar').removeClass('progress-bar-success');
						if ($current == 1)
							$('#rootwizard').find('.bar').addClass('progress-bar-warning');
						else
							$('#rootwizard').find('.bar').removeClass('progress-bar-warning');
						// Per l'ultimo tab attivare il bottone di chiusura
						if($current >= $total) {
							//$('#rootwizard').find('.pager .next').hide();
							$('#rootwizard').find('.pager .finish').show();
							$('#rootwizard').find('.pager .finish').css({display: 'inline'});
							$('#rootwizard').find('.pager .finish').removeClass('disabled');
						} else {
							//$('#rootwizard').find('.pager .next').show();
							$('#rootwizard').find('.pager .closer').addClass('fright');
							$('#rootwizard').find('.pager .finish').hide();
						}
					},
				onTabClick: function(tab, navigation, index) {
						return false;
					}
    		}
		);
}

function populateSteps ($current, filters)
{
	var validity = true; //todo
	if (!validity){
		window.console&&console.log('Taxonomie Filters Error: Inconsistency!');
		return;
	}
	
	// init pointers
	var $tab0 = $current.find('#tab0');
	var $sel0 = $current.find('#q_0-0');
	
	// return to first
	$current.find('.pager .first').click();
	
	// fill content in select
	$tab0.find('label').html(filters['question']);
	$sel0.find('option').remove();
	$sel0.append($("<option />")
			.val('0')
			.html('---'));
	$.each(filters['responces'], function(index, value) {
		$sel0.append($("<option />")
				.val(value['id'])
				.prop('data-filters',value)
				.html(value['responce']));
	});
	// activate triggers
	$sel0.on('change', function(e)
		{
			var res = parseInt($(this).val());
			if(e && res > 0){
				// init pointers
				var $tab1 = $current.find('#tab1');
				var $laucher = $current.find('#ticketLaucher');
				var $close = $current.find('.closer');
				
				// clone previous
				$tab1.html($tab0.html());
				var $sel1 = $tab1.find('select');
				
				// set current taxonomie
				$laucher.attr('data-taxonomie', ''+res);
				// use current filters
				var filters = $(this).find('option:selected').prop('data-filters');
				
				if (filters['responces'].length > 0 )
				{
					var validity = true; //todo
					if (!validity){
						window.console &&
							console.log('Taxonomie Filters Error: Inconsistency to Second Step!');
						return;
					}

					$tab1.find('label').html(filters['question']);
					$sel1.attr('id',filters['id']);
					$sel1.find('option[value="0"]').siblings('option').remove();
					
					$.each(filters['responces'], function(index, value) {
						$sel1.append($("<option />")
								.val(res+'-'+value['id'])
								.prop('data-filters',value)
								.html(value['responce']));
					});
					
					$sel1.on('change', function(e){
						var res = $(this).val();
						if(e && res!=0)
						{
							$laucher.removeClass('hidden').attr('data-taxonomie', res);
							$close.removeClass('fright');
						} else {
							$laucher.addClass('hidden');
							$close.addClass('fright');
						}
					});
					
					$laucher.addClass('hidden');
				}
				else if (filters['question'])
				{
					// no resps -> no select
					$tab1.find('select').remove();
					// quuestion -> stop with description
					$tab1.find('label').addClass('text-danger').html(filters['question']);
					$laucher.addClass('hidden');
					$close.addClass('fright');
				}
				else
				{
					// no resps -> no select &
					$tab1.find('select').remove();
					// no question -> continue with default msg
					$tab1.find('label').text(continueText);
					$laucher.removeClass('hidden');
					$close.removeClass('fright');
				}
				$current.find('.pager .next').click();
			}
		});
}