function onShowTicketModal (e) {
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
			"taxonomie"		 :   true,
	};
    
    if ($related.length)
    {
        $.each(assignments, function(index, attr){

            var data = (attr)?$related.attr('data-'+index):$related.prop('data-'+index);

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

    	var filters		= $related.prop('data-filters');
    	var taxonomie	= $current.find('input:hidden[name="taxonomie"]').val();
		var $taxonomie = $current.find('#taxonomie');
		$taxonomie.html('');

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
    		// nuovo ticket
        	if(filters && taxonomie)
        	{
        		// show it
        		var func = function(obj){ return obj.id == this; };
        		$.each(taxonomie.split('-'), function(index, value){
        			var item = filters['responces'].filter(func, value);
        			if (item.length){
        				filters = item[0];
        				$taxonomie.append($('<label/>')
							.addClass('badge btn-primary')
							.attr('data-prop', 'title')
							.attr('title', filters['responce'])
							.html(filters['responce'].trimToLength(20)));
        				$taxonomie.append($('<br/>'));
        			}
        		});
        	}
        	
        	
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
    var url = articles_url;
    
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
	if (a['From'].indexOf( getUser().email ) > -1) {
		author = getUser().name + " <"+ getUser().email +">" ;
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
}