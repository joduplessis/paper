






function paperEvent( eventName ) {

	if (eventName.split(',').length==1) { 
		paperEventCore(eventName);
	} else {
		var arrayLength = eventName.split(',').length;
		var original = eventName.split(',') ;
		for (var i = 0; i < arrayLength; i++) {
		    paperEventCore(original[i]);
		}
	}
	
}

function paperEventCore(eventName) {

	$.each(eventRegistry, function(name, value) {		
		if (eventName == value.event.id) {	
			setTimeout(function() {			
				switch( value.event.type ) {
					case 'animation': 	paperAnimation(value.event); break;
					case 'url': 		paperURL(value.event); break;
					case 'page': 		paperPage(value.event); break;
					case 'position': 	paperPosition(value.event); break;					
					case 'tooltip': 	paperTooltip(value.event); break;
				}
			}, value.event.delay);
		}
	});

}

function paperURL(value) {

	window.open(value.url, '_blank') ;

}

function paperPage(value) {

	switch (value.page) {
		case 'next':
			if ( globalPage+1<=totalPages ) { 
				globalPage++; 
				positionPage( globalPage ) ; 
			} 
		break;
		case 'previous':
			if ( globalPage-1>0 ) { 
				globalPage--;  
				positionPage( globalPage ) ; 
			} 
		break;
		default:
			positionPage( value.page ) ;
		break;
	}

}

function paperTooltip(value) {

	var elementObject = $('div[data-id="'+value.object+'"]') ;
	var screenWidth = $(window).width() ;
	var screenHeight = $(window).height() ;
	var xPosition = elementObject.position().left ;
	var yPosition = elementObject.position().top ;
	var text = value.text;
	var startX, startY = 0;
	var verticalPadding = 10 ;
	var hover = false ;
	var tooltipHTML, tooltipObject ;

	tooltipHTML = '<div class="tooltip"></div>' ;

	tooltipObject = $(tooltipHTML);
	tooltipObject.append('<p>'+text+'</p>') ;
	tooltipObject.append('<div class="pointer"></div>') ;
	tooltipObject.appendTo('body');

	// calculate start position
	
	startX = elementObject.offset().left ;				
	startY = elementObject.offset().top - tooltipObject.outerHeight(true) - verticalPadding;
		
	if (startY<0) {
		startY = elementObject.offset().top + elementObject.outerHeight(true) + verticalPadding;
		tooltipObject.find('.pointer').addClass('top') ;
	} 
	
	if ( ( startX + tooltipObject.outerWidth() ) > screenWidth ) {
		startX = startX - tooltipObject.outerWidth() + elementObject.outerWidth() ;
		tooltipObject.find('.pointer').css({left:tooltipObject.outerWidth()-tooltipObject.find('.pointer').outerWidth()-10});
	}
	
	tooltipObject.css({top:startY+'px',left:startX+'px'});
	
	setTimeout(function() { tooltipObject.remove(); }, value.timeout) ;

}

function paperPosition(value) {

	var elementObject = $('div[data-id="'+value.object+'"]') ;
	var elementObjectParent = elementObject.parent().parent() ;
	var x =  elementObject.position().left * -1 ;
	var y =  elementObject.position().top * -1 ;

	if (elementObjectParent.attr('data-type')) {
		elementObjectParent.scrollPosition(x, y);
	}

}

function paperToggle(pageNumber) {

	var pageObject = $('div[data-page="'+pageNumber+'"]') ;

	pageObject.find('div').each(function(index,obj) {

		var object = $(obj) ;

		if ( object.attr('data-id')!= undefined ) {

			if ( object.attr('data-id').substr(object.attr('data-id').length - 5)== 'price' ) {

				if ( object.css('opacity')==0 ) {
					object.animate({'opacity': 1}) ;
				} else {
					object.animate({'opacity': 0}) ;
				}

			}

		}

	});
}


function paperAnimation(value) {

	var elementObject = $('div[data-id="'+value.object+'"]') ;

	var duration = value.duration ;
	var ease = value.ease ;
	var toggle = value.toggle ;
	var callback = value.callback ;
	var properties = value.properties ;

	var jqueryCSS = {};

	// here we do the toggling
		
	if ( elementObject.hasClass('toggled') ) {

		if (toggle) {
			jqueryCSS = createCSSJSON( elementObject.attr('style-toggle') ) ;
			elementObject.removeClass('toggled') ;
		}

	} else {

		jqueryCSS = value.properties ;
		elementObject.addClass('toggled') ;	

	}

	// animate the css

	elementObject.css({'z-index': jqueryCSS['z-index']});

	elementObject.animate(jqueryCSS, Number(duration), ease, function() { paperEvent( callback ) ; }) ;

}




















