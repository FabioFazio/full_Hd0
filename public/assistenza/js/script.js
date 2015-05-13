//****** READY ******// 

$(function () {

	authenticated = !($.cookie("user") === undefined);
	
    /////////////////////////////////////////////
    //////__LOAD EXTERNAL SNIPPET CODE__ ////////
    /////////////////////////////////////////////

    loadFullDoc(document);
    
	/////////////////////////////////////////////
	//////// __DETECT CLIENT BROWSER__ ////////// 
	/////////////////////////////////////////////

	var browserK = get_browser();
    var browserV = get_browser_version();
     if (browserK.indexOf('IE') >= 0 && browserV < 9)
    	alert('Internet Explorer supported from ver.9. Actually you are using ver.: ' + browserV);
    //alert(browserK +' ver.' + browserV);
	
     if (browserK.indexOf('IE') >= 0){
    	 $(".titleTicket").removeClass("row");
     }

	/////////////////////////////////////////////
	/////////// __DRAG & DROP LIST__ //////////// NOT USED
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
	////////////// __BLINKING__ ///////////////// NOT USED
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
	///////////// __WAITING__ ///////////////////
	/////////////////////////////////////////////    
    
    // http://www.dallalibera.net/animazione-attendere-prego-con-jquery/
    
    $(document).on({
    	ajaxStart: startWait,
    	ajaxStop: function() { 
    		setTimeout(stopWait, 1000);
    	}
	});
});