// mock
var questions=
{0:{0:'Da quale dispositivo hai acceduto al servizio?'},
	1:{
		0:'In che momento si è riscontrato il problema?',
		1:'Che browser hai utilizzato per accedere al servizio?',
		3:'Che modello di smarphone hai utilizzato per accedere al servizio?'
	}
};
var responces=
{
	0:{
		0:{0:'---', 1:'PC', 2:'Tablet', 3:'Smartphone', 4:'Altro'}
	},
	1:{
		0:{0:'---', 1:'Accesso al servizio',
			2:'Gestione delle utenze',
			3:'Finalizzazione di una stampa',
			4:'Altro'
		},
		1:{0:'---', 1:'Internet Explorer',
			2:'Firefox', 3:'Chrome', 4:'Altro'
		},
		3:{0:'---', 1:'Android',
			2:'IPhone', 3:'Windows Mobile', 4:'Altro'
		}
	}
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
			"questions"		 :   false,
			"responces"		 :   false,
	};
    
    $.each(assignments, function(index, attr){

        var data = (attr)?$related.data(index):$related.prop('data-'+index);
        var $item = $current.find('#ticketLaucher');
        
        if (attr)
        	$item.attr('data-'+index, data);
        else
        	$item.prop('data-'+index, data);
    });
    
    //var questions = $related.prop('data-questions');
    //var responces = $related.prop('data-responces');
    
    populateSteps($current, questions, responces);
    
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

function populateSteps ($current, questions, responces)
{
	var steps = questions.length;
	
	if (steps != responces.length){
		window.console&&console.log('Taxonomie Error: Question and Resp not aligned!');
		return;
	}
	
	var $tab0 = $current.find('#tab0');
	var $sel0 = $current.find('#q_0-0');
	
	$current.find('.pager .first').click();
	
	$tab0.find('label').text(questions[0][0]);
	$sel0.find('option').remove();
	$.each(responces[0][0], function(index, value) {
		$sel0.append($("<option />").val(index).text(value));
	});
	
	$sel0.on('change', function(e)
		{
			var res = $(this).val();
			if(e && res > 0){
				var $tab1 = $current.find('#tab1');
				var $laucher = $current.find('#ticketLaucher');
				var $close = $current.find('.closer');
				
				$tab1.html($tab0.html());
				$laucher.attr('data-filter', res);
				
				if (res in questions[1])
				{
					if (!(res in responces[1])){
						window.console&&console.log('Taxonomie Error: Question '+res+' without resp!');
						return;
					}
					$tab1.find('label').text(questions[1][res]);
					var $sel1 = $tab1.find('select');
					$sel1.attr('id','q_1-'+res)
					$sel1.find('option').remove();
					$.each(responces[1][res], function(index, value) {
						$sel1.append($("<option />").val(res+'-'+index).text(value));
					});
					
					$sel1.on('change', function(e){
						var res = parseInt($(this).val().split('-').pop());
						if(e && res > 0){
							$laucher.removeClass('hidden');
							$close.removeClass('fright');
						} else {
							$laucher.addClass('hidden');
							$close.addClass('fright');
						}
					});
					
					$laucher.on('click', function(e){
						$laucher.attr('data-filter', $sel1.val());
					});
					
					$laucher.addClass('hidden');
				}else{
					$tab1.find('label').text(continueText);
					$tab1.find('select').remove();
					$laucher.removeClass('hidden');
					$close.removeClass('fright');
				}
				$current.find('.pager .next').click();
			}
		});
}

/*
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
			"questions"		 :   false,
			"responces"		 :   false,
	};
    
    if ($related.length)
    {
        $.each(assignments, function(index, attr){

            var data = (attr)?$related.data(index):$related.prop('data-'+index);

            $current.find('input:hidden[name="'+index+'"]').prop('value',data);

            var $items = $current.find('*[data-name="'+index+'"][data-prop]');
             
            $items.each(function(k, item){
            	  var $item = $(item);
            	  $item.prop($item.data('prop'), data);
                });
             
            $items = $current.find('*[data-name="'+index+'"]').not('*[data-prop]');
            $items.text(data);

            $current.find('.'+index).removeClass(removeMetaColors).addClass(data);
        });
        
        $current.find('#ticketQueue').text( $('#ticketQueue').text().trimToLength(10) );
        
        if (parseInt($current.find('input:hidden[name="id"]').val())>0){

            // mostra box articoli
        	$current.find('.articoli').removeClass('hidden');
        	if(parseInt($current.find('input:hidden[name="articles"]').val())>0)
        		$('#articoli').removeClass('hidden');
        	else
        		$('#articoli').addClass('hidden');
        	// blocca gli input
        	$current.find('input').add($current.find('textarea')).each(
                	function(){this.disabled = true;});
        	$("#priority .btn").addClass('disabled');
        	// bottoni sono per chiusura
        	$("#send").add("#cancel").addClass('hidden');
        	$("#close").removeClass('hidden');
        	// popola articoli
            loadArticles($current);
            // reset articoli
            $current.find('#articoli [role="tabpanel"]').collapse('hide');
        }else{

            // nascondi box articoli
        	$current.find('.articoli').addClass('hidden');
        	// abilita gli input
        	$current.find('input').add($current.find('textarea')).each(
                	function(){this.disabled = false;});
        	// bottoni per il submit
        	$("#priority .btn").removeClass('disabled');
        	$("#send").add("#cancel").removeClass('hidden');
        	$("#close").addClass('hidden');
    	}
    }
    
    colorize($current);
    $('.alert', $current.find('span[name="feedback"]') ).alert('close');
    priorityButton();
    $("#priority .btn").on('click', priorityButton);
}

function priorityButton (e) {
   var $button = e? $(this) : $('#priority .btn');
   var $input = $button.find('input:checkbox');
   if (e){
	   $input.prop("checked", !$input.prop("checked"));
   }
   if ($input.prop("checked"))
   {
	   $button.removeClass("btn-default").addClass("btn-danger");
	   $button.find(".glyphicon").removeClass("alert-danger");
	   if (!e) $button.addClass('active');
   } else {
	   $button.addClass("btn-default").removeClass("btn-danger");
	   $button.find(".glyphicon").addClass("alert-danger");
	   if (!e) $button.removeClass('active');
   }
}

function loadArticles ($current) {
	var id = $current.find('input[name="id"]').val();
	var serviceId = $current.find('input[name="service-id"]').val();
	
    var $target = $('#articoli');
    var request = {id : id, 'service-id': serviceId};
    var url = '/hd0/test/frontend/getArticles';
    
    $.ajax({
        type: 'post',
        url: url,
        data: request,
        success: function (data, status) {
        	window.console&&console.log(data);
            return showArticles (data, status, $target, $current );
        }
    });
}

function showArticles (articoli, status, $target, $current)
{
	$articolo = $target.find('.mock');
	$articolo.siblings().remove();

	var addArticle = "Per inviare nuovi aggiornamenti invia una mail a <b><a href='mailto://%mailservice%'>%mailservice%</a></b> (anche con allegati) dal tuo indirizzo di posta <b>%mail%</b> incollando come <b>Oggetto</b> della mail quanto segue: <br/><b><u>Re: Subject [Ticket#%num%]</u></b>";
	var num = $current.find('input[name="num"]').val();
	var mail = $('#auth_email').val();
	addArticle = addArticle.replace(/%mailservice%/g,'hd0@zenatek.com').replace('%mail%',mail).replace('%num%',num);

    $("a[data-toggle='alert']").on('click', function(e){
             var alert = {'alert-info': addArticle};
             alertHint( $current.find('span[name="feedback"]'), alert );
        });
	
	$.each(articoli, function(k,a){
			// create		  
	        var $clone = $articolo.clone().removeClass('mock').removeClass('hidden');
	        $target.prepend(updateArticle(a, $clone));
		});
	$current.find('input:hidden[name="articles"]').val(articoli.length);
	$target.find('[role="tabpanel"]:first').collapse('show');
}

function updateArticle (a, $articolo)
{
	$articolo.find('.panel-heading')
	   .attr('id', 'h_a'+ a['ArticleID']);
	$articolo.find('a[aria-controls]')
	   .attr('aria-controls', 'a'+ a['ArticleID'])
	   .attr('href', "#"+ 'a'+ a['ArticleID']);
	   
    var author = escapeHtml(a['FromRealname']);
	if (a['From'].indexOf( $('#auth_email').val() ) > -1) {
		author = $('#auth_name').val();
	}
   $articolo.find('span[data-name="authorName"]').text(author);

	   
	$articolo.find('span[data-name="created"]')
	   .text(a['Created']);
	   
	$articolo.find('[role="tabpanel"]')
	   .attr('id', 'a'+ a['ArticleID'])
	   .attr('aria-labelledby', 'h_a'+ a['ArticleID']);
	$articolo.find('span[data-name="body"]')
	   .empty().html(a['Body'].replace(/\n/g, "<br/>"));
	return $articolo;
}*/