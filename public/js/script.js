"use strict";

/////////////////////////////////////////////
//////// __DETECT CLIENT BROWSER__ ////////// 
/////////////////////////////////////////////

function get_browser() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] == 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem != null) { return 'Opera ' + tem[1]; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return M[0];
}
 
function get_browser_version() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        //return 'IE '+(tem[1]||'');
        return (tem[1] || '');
    }
    if (M[1] == 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        //if(tem!=null)   {return 'Opera '+tem[1];}
        if (tem != null) { return tem[1]; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return M[1];
}

/////////////////////////////////////////////
///////////// __CONFIRMATION__ //////////////
/////////////////////////////////////////////

function closeConf(e) {
	$(this).closest('div.popover').siblings('[data-toggle="confirmation"]').confirmation('hide');
}

function submitConf(e) {
	$(this).closest('div.popover').siblings('[data-toggle="confirmation"]').siblings('form').submit();
}

/////////////////////////////////////////////
///////////// __FORM SUBMIT__ ///////////////
/////////////////////////////////////////////

function formSubmit ( form )
{
	var $form = $(form);
    var $target = $($form.attr('data-target'));
    
    $.ajax({
        type: $form.attr('method'),
        url: $form.attr('action'),
        data: $form.serialize(),
        success: function (data, status) {
        	window.console&&console.log(data);
            return formResponce (data, status, $target, $form );
        }
    });
}

function formResponce ( data, status, $msgBox, $form )
{
	//console.log(data); // for debugging
	// display feedback cleaning previous

	alertHint( $msgBox, data, $form );

	if (status=='success' && !('alert-warning' in data) && !('alert-danger' in data)){
		// update page
		//loadFullPage (data['email']);
		setTimeout(function() {
				$msgBox.closest('.modal').modal('hide');
				$('.alert', $msgBox ).alert('close');
			}, 1500);
	}
} 

function alertHint ( $target, data, $form )
{
	var hint_box = '<div class="alert %type%" role="alert">';
	hint_box += '<button type="button" class="close" data-dismiss="alert">×</button>';
	hint_box += '<span>%hint%</span>';
	hint_box += '</div>';

	$('.alert', $target ).alert('close');
	$.each(data, function (index, value){
		if ( $.inArray(index, ['alert-warning','alert-info','alert-danger','alert-success']) > -1 )
			$target.prepend ( hint_box.replace ( /%hint%/g, value ).replace ( /%type%/g, index ));
		else{
			var paramId = (index.indexOf("_") >= 0)? index : $form.attr('id') +'_'+ index;
			if ($('#'+paramId).length)
				$('#'+paramId).val( value );
			else
				$target.before(
					$('<input>').attr('type','hidden')
						.attr('id', paramId)
						.attr('name', index)
						.val( value )
				);
			$('#'+paramId).trigger('change');
		}
	});
	$target.alert();
}

$(function () {
	
	/////////////////////////////////////////////
	//////// __DETECT CLIENT BROWSER__ ////////// 
	/////////////////////////////////////////////

	var browserK = get_browser();
    var browserV = get_browser_version();
     if (browserK.indexOf('IE') >= 0 && browserV < 7)
    	alert('Internet Explorer supported from ver.7. Actually you are using ver.: ' + browserV);
    //alert(browserK +' ver.' + browserV);
	
	/////////////////////////////////////////////
	/////////// __DRAG & DROP LIST__ //////////// 
	/////////////////////////////////////////////
	
	/**
	 // Add icon 'move' in simple draggable <li> items to activate them
	 $("ol.simple_with_drop li, ol.simple_with_no_drop li").prepend(
	 		'<span class="glyphicon glyphicon-move"></span> ');
	 */
	  // add silently css for li
	  $("ol.bugsBox li").addClass('well');

	  if (!(browserK.indexOf('IE') >= 0 && browserV == 7))
	  {
		  // initialize all sortable lists
		  $("ol.sortable_with_animation").sortable({
			  group: 'sortable_with_animation',
			  pullPlaceholder: false,
			  // animation on drop
			  onDrop: function  (item, targetContainer, _super) {
			    var clonedItem = $('<li/>').css({height: 0});
			    item.before(clonedItem);
			    clonedItem.animate({'height': item.height()});
			    
			    item.animate(clonedItem.position(), function  () {
			      clonedItem.detach();
			      _super(item);
			    });
			  },
	
			  // set item relative to cursor position
			  onDragStart: function ($item, container, _super) {
			    var offset = $item.offset(),
			    pointer = container.rootGroup.pointer;
	
			    adjustment = {
			      left: pointer.left - offset.left,
			      top: pointer.top - offset.top
			    };
	
			    _super($item, container);
			  },
			  onDrag: function ($item, position) {
			    $item.css({
			      left: position.left - adjustment.left,
			      top: position.top - adjustment.top
			    });
			  }
		  });
		  
		  $("ol.simple_with_drop").sortable({
			  group: 'no-drop',
			  handle: 'span.glyphicon-move',
			  onDragStart: function (item, container, _super) {
			    // Duplicate items of the no drop area
			    if(!container.options.drop)
			      item.clone().insertAfter(item);
			    _super(item);
			  }
		  });
		  
		  $("ol.simple_with_no_drop").sortable({
			  group: 'no-drop',
			  drop: false
		  });
		  $("ol.simple_with_no_drag").sortable({
			  group: 'no-drop',
			  drag: false
		  });
	  }
	  
	/////////////////////////////////////////////
	////////////// __BLINKING__ ///////////////// 
	/////////////////////////////////////////////
	  
	// Source: http://www.antiyes.com/jquery-blink-plugin
	// http://www.antiyes.com/jquery-blink/jquery-blink.js

	$.fn.blink = function(options) {
        var defaults = {
            delay: 500
        };
        var options = $.extend(defaults, options);

        return this.each(function() {
            var obj = $(this);
            setInterval(function() {
                if ($(obj).css("visibility") == "visible") {
                    $(obj).css('visibility', 'hidden');
                }
                else {
                    $(obj).css('visibility', 'visible');
                }
            }, options.delay);
        });
    };

    $('.blink').blink(); // default is 500ms blink interval.
    $('.blink_fast').blink({
        delay: 250
    }); // causes a 250ms blink interval.
    $('.blink_slow').blink({
        delay: 1000
    }); // causes a 1000ms blink interval. 
    
	/////////////////////////////////////////////
	///////////// __CONFIRMATION__ //////////////
	/////////////////////////////////////////////

    var optConfBase = {
    		singleton: true,
    		popout: true,
    		//template: '',
    		html: true,
    		onCancel: closeConf,
    }; 
    
    var optConfDelete = $.extend({
			btnOkIcon: 'glyphicon glyphicon-trash',
    		btnOkLabel: 'Cancella',
    		btnOkClass: 'btn btn-xs btn-danger',
			btnCancelIcon: '',
			btnCancelLabel: 'Annulla',
    		btnCancelClass: 'btn btn-xs btn-default pull-right',
			
    	}, optConfBase);
    
    var optConfForm = $.extend({onConfirm : submitConf,}, optConfBase);
    
    $('[data-toggle="confirmation"][data-href]').has('span.glyphicon-trash').confirmation(optConfDelete);

	/////////////////////////////////////////////
	///////////// __TOOLTIP__ ///////////////////
	/////////////////////////////////////////////
    
    var optTooltBase = {
    		aniumation:	false,
    		delay:		{ "show": 100, "hide": 100 },
    		html:		true,
    };

    $('[data-toggle="tooltip"][title_0]:not([title])').each(function(){
    	var t = 0, n = 0;
    	$(this).attr('data-current', n);
    	
    	var attr = $(this).attr('title_'+ t);
    	while ((typeof attr !== typeof undefined) && (attr !== false))
    		attr = $(this).attr('title_'+ ++t);
    	
    	$(this).attr('data-total', t);
    	
    	var paging = "<br /><small>1/"+ t +"<small>";
    	$(this).attr('title', $(this).attr('title_' + n)  + paging );
    	$('span.glyphicon-question-sign', this).addClass('alert-warning');
    });
    
    $('[data-toggle="tooltip"][data-current]').on( 'click', function(){
    	var n = parseInt($(this).attr('data-current'),10) + 1;
    	var t = parseInt($(this).attr('data-total'),10);
    	n = (n >= t)? 0 : n;
    	$(this).attr('data-current', n);
    	var paging = "<br /><small>" + (n+1) + "/"+ t +"<small>";
    	$(this).attr('title', $(this).attr('title_' + n) + paging);
    	
    	$(this).tooltip('destroy');
    	$(this).tooltip(optTooltBase);
    	$(this).tooltip('show');
    	$(this).on('hidden.bs.tooltip', function () {
    		$('.tooltip').remove();
    	});
    });
    
    $('[data-toggle="tooltip"][title]').tooltip(optTooltBase);
   
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
							$('#rootwizard').find('.pager .next').hide();
							$('#rootwizard').find('.pager .finish').show();
							$('#rootwizard').find('.pager .finish').removeClass('disabled');
						} else {
							$('#rootwizard').find('.pager .next').show();
							$('#rootwizard').find('.pager .finish').hide();
						}
					},
				onTabClick: function(tab, navigation, index) {
						return false;
					}
    		});

	/////////////////////////////////////////////
	///////////// __WAITING__ ///////////////////
	/////////////////////////////////////////////    
    
    // http://www.dallalibera.net/animazione-attendere-prego-con-jquery/
    
    $(document).on({
    	ajaxStart: function() { $("body").addClass("loading"); },
    	ajaxStop: function() { 
    		setTimeout(function(){$("body").removeClass("loading");},1000);
    	}
	});
    
	/////////////////////////////////////////////
	///////////// __FORM SUBMIT__ ///////////////
	/////////////////////////////////////////////
    
    $('form[data-async]').not('form[data-validate]').submit ( 
    		function(event){
    			formSubmit(this);
    			event.preventDefault();
    		}
    	);
    
	/////////////////////////////////////////////
	/////////// __FORM VALIDATION__ /////////////
	/////////////////////////////////////////////
    
    // http://formvalidator.net/index.html#configuration_setup
    // http://formvalidator.net/#reg-form
    // https://github.com/victorjonsson/jQuery-Form-Validator/tree/master/form-validator
    
    $.formUtils.addValidator({
    	  name : 'domain',
    	  validatorFunction : function(value, $el, config, language, $form) {
    		  var domains = ['iper.it','ortofin.it','unes.it', 'zenatek'];
    		  var valid = false;
    		  while (domains.length > 0)
    			  {
    			  	valid |= value.indexOf(domains.shift()) > -1;
    			  }
    		  return valid; 
    	  },
    	  errorMessage : 'La mail deve essere di lavoro: @iper.it @ortofin.it @unes.it etc..', /* non usato */
    	  errorMessageKey: 'badDomain'
    	});
    
    $.validate({
    	form: 'form[data-validate]',
    	modules : 'date, security',
    	dateFormat: 'dd/mm/yyyy',
    	decimalSeparator: ',',
    	onSuccess: function(form){formSubmit(form); return false;},
    	onError: function(){return false;}, // Stop the submission
    });
    
    $('form[data-validate]').closest('.modal').on('click', 'button[data-dismiss="modal"]', function(){
    	// clear form and alerts
    	$('form', $(this).closest('.modal')).get(0).reset();
    });
    
});