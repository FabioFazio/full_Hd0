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

function closeConf(e) {
	$(this).closest('div.popover').siblings('[data-toggle="confirmation"]').confirmation('hide');
}

function submitConf(e) {
	$(this).closest('div.popover').siblings('[data-toggle="confirmation"]').siblings('form').submit();
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
    	var n = 0;
    	$(this).attr('data-current', n);
    	$(this).attr('title', $(this).attr('title_' + n));
    });
    
    $('[data-toggle="tooltip"][data-current]').on( 'click', function(){
    	var n = parseInt($(this).attr('data-current'),10) + 1;
    	var attr = $(this).attr('title_'+ n);
    	if (typeof attr === typeof undefined || attr === false) {
    	    n = 0;
    	}
    	$(this).attr('data-current', n);
    	$(this).attr('title', $(this).attr('title_' + n));
    	
    	$(this).tooltip('destroy');
    	$(this).tooltip(optTooltBase);
    	$(this).tooltip('show');
    	$(this).on('hidden.bs.tooltip', function () {
    		$('.tooltip').remove();
    	})
    });
    
    $('[data-toggle="tooltip"][title]').tooltip(optTooltBase);
    
});