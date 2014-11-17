$(function () {
	/**
	 // add icon move in simple draggable <li> items to activate them
	 $("ol.simple_with_drop li, ol.simple_with_no_drop li").prepend(
	 		'<span class="glyphicon glyphicon-move"></span> ');
	 */
	  // add silently css for li
	  $("ol.bugsBox li").addClass('well');
			  
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
});