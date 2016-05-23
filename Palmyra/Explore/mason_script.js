function triggerMasonry() {

	var $grid = $('.grid').imagesLoaded( function() {
	  $grid.masonry({
	    itemSelector: '.grid-item',
	    percentPosition: true,
	    columnWidth: '.grid-sizer'
	  }); 
	});
     $grid.masonry('reloadItems')

}