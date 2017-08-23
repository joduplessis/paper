var globalPage = 1;
var totalPages = 0 ;
var pageWidth ;
var pageHeight ;
var loader ;
var masterObject ;
var mode = 'live';
var pagesLoaded = [] ;
var eventRegistry = [] ;

$(document).ready(function() {

	$('a.arrow-right').on('click', function(e){
		if ( globalPage+1<=totalPages ) {
			globalPage++;
			positionPage(globalPage) ;
		}
	});

	$('a.arrow-left').on('click', function(e){
		if ( globalPage-1>0 ) {
			globalPage--;
			positionPage(globalPage) ;
		}
	});

	// create the loader div
	loader = $('<div data-type="loader"></div>');
	masterObject = $('div[data-type="paper"]') ;

	// get the widget and height
	pageWidth = masterObject.innerWidth();
	pageHeight = masterObject.innerHeight();

	// Set all of the element dimensions
	$('div[data-type="loader"]').css({'width': PROJECT_WIDTH+'px', 'height': PROJECT_HEIGHT+'px'}) ;
	$('div[data-type="page"]').css({'width': PROJECT_WIDTH+'px', 'height': PROJECT_HEIGHT+'px'}) ;
	$('div[data-type="paper"]').css({'width': PROJECT_WIDTH+'px', 'height': PROJECT_HEIGHT+'px'}) ;
	$('.catalogue').css({'width': PROJECT_WIDTH+'px', 'height': PROJECT_HEIGHT+'px'}) ;

  // get total number of pages
  $('div[data-type="page"]').each(function(index, object) {
		totalPages++ ;
	});

	// set up swipe action on master container
	// TODO
	/*
	masterObject.swipe({
		swipe:function(event, direction, distance, duration, fingerCount) {

				if (direction=="left") {
					if ( globalPage+1<=totalPages ) {
						//globalPage++;
						//positionPage( globalPage ) ;
					}
				}

				if (direction=="right") {
					if ( globalPage-1>0 ) {
						//globalPage--;
						//positionPage( globalPage ) ;
					}
				}

		}, threshold:400
	});
	*/

	// preload all assets
	loadAssets() ;

	positionPage(globalPage) ;

});

// load all of the assets used in the publication

function loadAssets() {

	var imageCount = 0 ;
	var arrayCount = 0;
	var imageObj ;
	var images = new Array();

	// add load screen

	loader.appendTo( masterObject ) ;

	// get all images into an array

	images[imageCount] = "" ;

	imageCount++ ;

	masterObject.find('div[data-type="image"]').each(function(index, divObject) { images[arrayCount] = $(divObject).attr('data-src') ; arrayCount++ ; }) ;
	masterObject.find('div[data-type="slideshow"]').each(function(index, divObject) { slides = $(divObject).attr('data-src').split(',') ; slides.forEach(function(entry) { images[arrayCount] = entry; arrayCount++ ; }); }) ;
	masterObject.find('div[data-type="sequence"]').each(function(index, divObject) { sequences = $(divObject).attr('data-src').split(',') ; sequences.forEach(function(entry) { images[arrayCount] = entry; arrayCount++ ; }); }) ;

	// load images in array as new images

	for (imageCount = 0; imageCount < images.length; imageCount++) {
		imageObj = new Image();
		imageObj.src = images[imageCount];
	}

	// once the images are loaded we create the layout & the ui

	imageObj.onload = function(){ initObjects(); };

}

// load the layout of the pages after the assets are loaded

function initObjects() {

	// itirate through all objects
	$('div[data-type="paper"]').find('div').each(function(index, object) {

		// create the paper object
		var paperObject = $(object);
		var paperObjectTouchEvent = paperObject.attr('data-event-on-touch') ;
		var paperObjectNavigateTouchEvent = paperObject.attr('data-event-navigate-on-touch') ;
		var paperObjectType = paperObject.attr('data-type') ;
		var paperObjectPriceToggle = paperObject.attr('data-toggle-prices') ;

		// create elements
		switch( paperObjectType ) {
			case 'gizmo': 		paperObject.paperGizmo( mode ); 	break;
			case 'html': 		paperObject.paperHTML( mode ); 		break;
			case 'image': 		paperObject.paperImage( mode ); 	break;
			case 'video': 		paperObject.paperVideo( mode ); 	break;
			case 'slideshow': 	paperObject.paperSlideshow( 'edit' ); break;
			case 'sequence': 	paperObject.paperSequence( mode ); 	break;
		}

		// touch event
		if ( paperObjectTouchEvent != undefined && paperObjectTouchEvent != 'none' && paperObjectTouchEvent != '') {
			paperObject.on('click', function(e){
				paperEvent( paperObjectTouchEvent );
			}) ;
		}

		// touch event - navigate pages
		if ( paperObjectNavigateTouchEvent != undefined && paperObjectNavigateTouchEvent != 'none' && paperObjectNavigateTouchEvent != '') {
			paperObject.on('click', function(){
				positionPage( paperObjectNavigateTouchEvent ) ;
			}) ;
			paperObject.on('mouseover', function(){
				paperObject.find('img').css({'cursor':'pointer'});
			});
		}

		// touch event - toggle prices
		if ( paperObjectPriceToggle == 'true' ) {
			paperObject.on('click', function(){
				paperToggle( globalPage );
			}) ;
		}

	});

	// initialize the first page
	positionPage(globalPage) ;

	// after everything is loaded, wait a second
	setTimeout(function() {
		loader.fadeOut('slow', function(){ loader.remove(); }) ;
	}, 1000);

}

function checkValue(val) {
}

// initiliaze the page

function positionPage(pageNumber) {

	var pageObject = $('#paper div:nth-child('+(pageNumber)+')') ;

	var pos ;
	var actualPageNumber ;
	var isLoaded = false ;

	if (pagesLoaded.indexOf(pageNumber)!=-1) {
		isLoaded = true ;
	}

	// set up the new events
	$.ajax({
		url: SITE_URL+'/pages/'+pageNumber+'/events',
		type: 'POST',
		success: function(data) {
		 	// TODO
		 	// eventRegistry = $.parseJSON(data) ;
			// if we trigger this from another place, we assign it
			globalPage = pageNumber ;
			// move the slides
			$('div[data-type="page"]').each(function(index, object) {
				actualPageNumber = pageNumber-1  ;
				pos = ( index*pageWidth ) - ( actualPageNumber * pageWidth ) ;
				if ( index == actualPageNumber ) { $(this).css({'z-index': 2}); } else { $(this).css({'z-index': 1}); }
				switch ( index ) {
					case ( actualPageNumber-1 ): $(this).css({'display': 'block'}); $(this).animate({'left': pos}, 1000, function(){ $(this).css({'display': 'none'}); }); break;
					case ( actualPageNumber ):  $(this).css({'display': 'block'}); $(this).animate({'left': pos}, 1500, 'easeOutCubic'); break;
					case ( actualPageNumber+1 ): $(this).css({'display': 'block'}); $(this).animate({'left': pos}, 1000, function(){ $(this).css({'display': 'none'}); }); break;
					default: $(this).css({'left': pos});  break;
				}
			});

			// auto fade in object
			pageObject.find('div').each(function(index, object) {
				var paperObject = $(object);
				var paperObjectType = paperObject.attr('data-type') ;
				if ( paperObjectType == 'slideshow' ) {
					paperObject.paperSlideshow(mode);
				}
				if ( isLoaded == false ) {
					if ( paperObject.attr('data-ignore-fadein') == 'false' || paperObject.attr('data-ignore-fadein') == undefined ) {
						var temporaryTop = paperObject.position().top ;
						var temporaryLeft = paperObject.position().left ;
						var temporaryOpacity = paperObject.css('opacity') ;
						var temporaryDelay = paperObject.attr('data-fadein-delay') * 1000 + 500;
						var fadeInSpeed = 1500 ;
						var fadeInEase = 'easeInOutBack' ;
						var opacity = 1;
						if ( paperObject.attr('data-id')!= undefined ) {
							if ( paperObject.attr('data-id').substr(paperObject.attr('data-id').length - 5)== 'price' ) {
								opacity = 0 ;
							}
						}
						// set the intro position
						if ( paperObject.attr('data-fadein-slide') == 'true' ) {
							paperObject.css({ 'top': temporaryTop, 'left': temporaryLeft + 300, 'opacity': 0 }) ;
						} else {
							paperObject.css({ 'top': temporaryTop - 100, 'left': temporaryLeft, 'opacity': 0 }) ;
						}
						// animate it
						setTimeout((function() {
							// if the object isn't already made to be transparent
							if (temporaryOpacity!=0) {
								paperObject.animate({ 'top': temporaryTop, 'left': temporaryLeft, 'opacity': opacity }, fadeInSpeed, fadeInEase) ;
							} else {
								paperObject.animate({ 'top': temporaryTop, 'left': temporaryLeft }, fadeInSpeed, fadeInEase) ;
							}
						}), temporaryDelay);
					}
				}
			});

			// page load events
			if ( pageObject.attr('data-event-on-pageload')!=undefined ) {
				paperEvent( pageObject.attr('data-event-on-pageload') );
			}
		}
	});

	pagesLoaded.push(pageNumber) ;

}

// convert css to json

function createCSSJSON(css) {

    var s = {};

    css = css.split("; ");

    for (var i in css) {
        var l = css[i].split(": ");
    	if ( l[1] != 'undefined') {
        	s[ l[0] ] = l[1] ;
        }
    }

    return s;

}
