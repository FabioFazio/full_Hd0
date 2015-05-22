"use strict";

//////////////////////////////////////////////
/////////////// __LIBRARY__///////////////////
//////////////////////////////////////////////

var fallbackForm = {};
var authenticated;

/**
 * Escane string before inject with $.html
 */
function escapeHtml(text) {
	  if (typeof text === 'undefined')
		  return '';
	  
	  var map = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#039;'
	  };

	  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * Cookies generator from object array {name: x, value: y}[] 
 * @param cookies
 */
function cookiesGenerator ( cookies ) {
	if ( cookies.length > 0 ) {
		$.each(cookies, function (i, v){
				// create/update all cookies one by one
				var name	= typeof v.name !== 'undefined'		? v.name : false;
				var content	= typeof v.value !== 'undefined'	? v.value : false;
				
				$.cookie(name, content, { expires: cookieExpires, path: cookiePath });
			});
	}
}

/////////////////////////////////////////////
//////__LOAD EXTERNAL SNIPPET CODE__ //////// 
/////////////////////////////////////////////

var nestedLoading = 0;

/**
 * 
 * @param scope
 * @param nested
 */
function loadFullDoc( scope, nested ) {
	
	nested = typeof nested !== 'undefined' ? nested : false;
	
	if (nested)
	{
		initScope ( scope );
	}
	
	var $snippets = $(scope).find("[data-include]");
	if ($snippets.length > 0) {
		
		$snippets.each(
				
			function(i, v){
				// fix from http://www.scratchyourself.com/jquery-load-complete-callback-function-doesnt-work-properly/
				// and from http://stackoverflow.com/questions/8905143/jquery-load-doesnt-work-with-a-defined-function-as-a-callback
				$(this).load($(this).data('include'), null, function(){loadFullDoc(this, true);});
			}
		);
	} else
	{
		initScope ( scope );		
	}
}

/////////////////////////////////////////////
////////////__INITIALIZATION__ //////////////
/////////////////////////////////////////////

/**
* Function to activate all jquery items in the scope
*/
function initScope ( scope ) {

	/////////////////////////////////////////////
	///////////// __CONFIRMATION__ //////////////
	/////////////////////////////////////////////

    $( scope ).find('[data-toggle="confirmation"][data-href]').has('span.glyphicon-trash').confirmation(optConfDelete);
    
	/////////////////////////////////////////////
	///////////// __FORM SUBMIT__ ///////////////
	/////////////////////////////////////////////
    
    $( scope ).find('form[data-async]').not('form[data-validate]').submit ( 
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
	
	var vallidate_default_options = {
			form: 'form[data-validate]',
			modules : 'date, security',
			dateFormat: 'dd/mm/yyyy',
			decimalSeparator: ',',
			onSuccess: function(form){formSubmit(form); return false;},
			onError: function(){return false;}, // Stop the submission
			onModulesLoaded: function() {
			    $('input[name="password_confirmation"]').displayPasswordStrength({
				      padding: '4px',
				      bad : 'Troppo Semplice',
				      weak : 'Debole',
				      good : 'Buona',
				      strong : 'Sicura'
			    });
		    }
	};
	
	$.validate(vallidate_default_options);
    
    $( scope ).find('form[data-validate]').closest('.modal').on('click', 'button[data-dismiss="modal"]', function(){
    	// clear form and alerts
    	$('form', $(this).closest('.modal')).get(0).reset();
    });
}

/////////////////////////////////////////////
//////////__WAITING FUNCTIONS__ ///////////// 
/////////////////////////////////////////////

/**
 * 
 */
function startWait () {
	$("body").addClass("loading");
}

/**
 * 
 */
function stopWait () {
	$("body").removeClass("loading");
}

/////////////////////////////////////////////
//////__CUSTOM STRING JS EXTENSION _ ////////
// http://stackoverflow.com/questions/4637942/how-can-i-truncate-a-string-in-jquery
/////////////////////////////////////////////

String.prototype.trimToLength = function(m) {
	  return (this.length > m) 
	    ? $.trim(this).substring(0, m).split(" ").slice(0, -1).join(" ") + "..."
	    : this;
	};

/////////////////////////////////////////////
//////// __DETECT CLIENT BROWSER__ ////////// 
/////////////////////////////////////////////

/**
 * 
 */
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
 
/**
 * 
 * @returns
 */
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

/**
 * 
 */
function closeConf(e) {
	$(this).closest('div.popover').siblings('[data-toggle="confirmation"]').confirmation('hide');
}

/**
 * 
 * @param e
 */
function submitConf(e) {
	$(this).closest('div.popover').siblings('[data-toggle="confirmation"]').siblings('form').submit();
}

/////////////////////////////////////////////
///////////// __FORM SUBMIT__ ///////////////
/////////////////////////////////////////////

/**
 * 
 */
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

/**
 * 
 * @param data
 * @param status
 * @param $msgBox
 * @param $form
 */
function formResponce ( data, status, $msgBox, $form )
{
	// display feedback cleaning previous

	alertHint( $msgBox, data, $form );
	
	// curstom actions
	if (typeof $form.attr('id') !== 'undefined')
	{
		var id = $form.attr('id');
		if (typeof fallbackForm[id] !== 'undefined')
		{
			fallbackForm[$form.attr('id')].call(document, data, status, $msgBox, $form);
		}
	}

	if (status=='success' && !('alert-warning' in data) && !('alert-danger' in data)){
		// update page
		//loadFullPage (data['email']);
		setTimeout(function() {
				$msgBox.closest('.modal').modal('hide');
				$('.alert', $msgBox ).alert('close');
				var refresh = parseInt($form.data('refresh'));
		    	//if(refresh >= 0) startWait();
		    	setTimeout(content,refresh);
			}, 1500);
	}
} 

/**
 * Manage error messages 
 * 
 * @param $target
 * @param data
 * @param $form
 */
function alertHint ( $target, data, $form )
{
	var hint_box = '<div class="alert %type%" role="alert">';
	hint_box += '<button type="button" class="close" data-dismiss="alert">×</button>';
	hint_box += '<span>%hint%</span>';
	hint_box += '</div>';

	$('.alert', $target ).alert('close');
	$.each(data, function (index, value){
		if ( $.inArray(index, ['alert-warning','alert-info','alert-danger','alert-success']) > -1 )
		{
			$target.prepend ( hint_box.replace ( /%hint%/g, value ).replace ( /%type%/g, index ));
			return true;
		}
		
		// $form can be undefined only if no index lack of undescore separator
		var paramId = (index.indexOf("_") >= 0)? index : $form.attr('id') +'_'+ index;
		
		if ($('#'+paramId).length)
		{
			$('#'+paramId).val( value );
		} else {
			$target.before(
					$('<input>').attr('type','hidden')
						.attr('id', paramId)
						.attr('name', index)
						.val( value )
				);
		}
		$('#'+paramId).trigger('change');
	});
	$target.alert();
}

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
