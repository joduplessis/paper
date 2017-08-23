(function($) {
    $.fn.extend({
		paperSequence: function(options) {

			var elementObject = this ; 

			// set up basic parameters

			var pagination = elementObject.attr('data-pagination');
			var paginationOffsetTop = Number(elementObject.attr('data-pagination-offset-top')) ; 
			var paginationOffsetSide = Number(elementObject.attr('data-pagination-offset-side')); 
			var srcList = elementObject.attr('data-src').split(',') ;
			var src = '' ;

			// add all the images to the sequence

			srcList.sort().forEach(function(entry) { src += '<img src="'+entry+'" height="100%" width="100%"/>'; });

			// other variables

			var mouseDown = false ;
			var mouseDownStartX, mouseDownCurrentX = 0;
			var height = elementObject.outerHeight() ;
			var width = elementObject.outerWidth() ;
			var currentSlide = 0 ;
			var totalSlides = srcList.length  ;
			var highestZ = 1 ;
			var paginationHTML = $('<div class="pagination"></div>') ;
			var fade = 50 ;

			// if there is pagination

			if (pagination=='true') {
				src += '<div class="button-next"></div>' ;
				src += '<div class="button-previous"></div>' ;		
			}

			// append the element to the DIV

			elementObject.html( src ) ; 		

			// functions

			this.identify = function() {
				console.log(elementObject.attr('data-id'));
			};	

			// add mouse events
	
			elementObject.on('mousedown', function(event) {
				mouseDown = true ;
				mouseDownStartX = event.clientX - elementObject.offset().left ;
			}) ;
			
			elementObject.on('mouseup', function(event) {
				mouseDown = false ;
			}) ;

			// on mouse down move
			
			elementObject.on('mousemove', function(event) {
				if (mouseDown) {
					mouseDownCurrentX = event.clientX - elementObject.offset().left ;
					if ((fmod(mouseDownCurrentX,3)==0)||(fmod(mouseDownCurrentX,2.5)==0)) {
						if (mouseDownCurrentX<=mouseDownStartX) {
							loadSlide("left");
						} else {
							loadSlide("right");
						}
					}
				}
			}) ;

			// mouse events for the buttons

			if (pagination=='true') {

				elementObject.find('.button-next').css({'top': paginationOffsetTop}) ;
				elementObject.find('.button-next').css({'right': paginationOffsetSide}) ;
				elementObject.find('.button-next').on('mousedown', function(event) { loadSlide("right"); });

				elementObject.find('.button-previous').css({'top': paginationOffsetTop}) ;
				elementObject.find('.button-previous').css({'left': paginationOffsetSide}) ;
				elementObject.find('.button-previous').on('mousedown', function(event) { loadSlide("left"); });	

			}

			// move slide up or down
			
			function loadSlide( direction ) {

				// only if it's live

				if ( options != 'edit' ) {
				
					highestZ++ ;
				
					switch (direction) {
						case "right": 	currentSlide++ ; if (currentSlide >= totalSlides) { currentSlide = 0 ; } break;
						case "left":	currentSlide-- ; if (currentSlide < 0) { currentSlide = totalSlides - 1 ; }	break;
					}
					
					$.each(elementObject.find("img").eq(currentSlide),function(i) {
						elementObject.find("img").eq(currentSlide).css("z-index", highestZ);
						elementObject.find("img").eq(currentSlide).animate({opacity: 0}, 0);
						elementObject.find("img").eq(currentSlide).animate({opacity: 1}, fade); 	
					});

				}
				
			}	

			function fmod(a,b) { return a % b; }

			// return the object		

			return elementObject ;

		}
    });
})(jQuery);



