(function($) {
    $.fn.extend({
		paperSlideshow: function(options) {

			var elementObject = this ; 

			// set some basic parameters

			var autoplay = elementObject.attr('data-autoplay');
			var loop = Number(elementObject.attr('data-loop'));		
			var pagination = elementObject.attr('data-pagination');
			var paginationOffset = Number(elementObject.attr('data-pagination-offset')); 
			var fade = Number(elementObject.attr('data-fade')); 
			var speed = Number(elementObject.attr('data-speed')); 
			var style = elementObject.attr('data-style'); 
			var srcList = elementObject.attr('data-src').split(',');
			var src = '' ;

			// add all the images to the slideshow

			srcList.sort().forEach(function(entry) { src += '<img src="'+entry+'" height="100%" width="100%"/>'; });

			// other variables

			var height = elementObject.outerHeight() ;
			var width = elementObject.outerWidth() ;
			var currentSlide = 0 ;
			var totalSlides = srcList.length  ;
			var highestZ = 1 ;
			var interval ;
			var intervalLoops = 0 ;
			var paginationHTML = $('<div class="pagination"></div>') ;

			// append the element to the DIV

			elementObject.html( src ) ; 		

			// if there is pagination enabled, then add it to the DIV too
			// we also attach events to the pagination clicks

			if (pagination=='true') {

				$.each(elementObject.find("img"),function(i){ 
					paginationHTML.append('<span id="'+i+'">&nbsp;</span>');
				});

				paginationHTML.appendTo(elementObject) ;

				paginationHTML.css({
					'left': '0px',
					'bottom': paginationOffset+'px',
					'width': '100%',
					'z-index': 9000 
				});	

				paginationHTML.find("span").on('click', function(object) {
					paginationHTML.find("span").removeClass("current");
					$(this).addClass("current");
					currentSlide = $(this).attr('id') ;
					init('paginate');
				});			

			}

			// start the first slide

			init('start') ;	


			// why is there a source?
			// because when a user clicks on the pagination buttons, the slides will cahnge
			// regardless of the autplay or loops
			
			function init(source) {

				// only if it's live

				if ( options != 'edit' ) {

					// slideshow reaches end
					
					if (currentSlide >= totalSlides) { 

						currentSlide = 0 ; 
						intervalLoops++; 

						if ( elementObject.attr('data-event-on-slideshow-complete')!=undefined ) { paperEvent( elementObject.attr('data-event-on-slideshow-complete') ); }

					}

					if (currentSlide < 0) { currentSlide = totalSlides ; }	

					if (intervalLoops<=loop || source=='paginate') {

						// move the slide to the top & fade it in

						$.each(elementObject.find("img").eq(currentSlide),function(i) {

							// fade it in

							if (style=='fade') {
								elementObject.find("img").eq(currentSlide).css({'opacity': 0, 'z-index': highestZ});				
								elementObject.find("img").eq(currentSlide).animate({'opacity': 1}, fade); 						
							}

							// slide it in

							if (style=='slide') {
								elementObject.find("img").eq(currentSlide).css({'left': width, 'z-index': highestZ});				
								elementObject.find("img").eq(currentSlide).animate({'left': 0}, fade, 'easeOutCubic'); 	
							}

							// if there is pagination

							if (pagination=='true') {
								paginationHTML.find("span").removeClass("current");
								paginationHTML.find("span").eq(currentSlide).addClass("current");
							}

						});

						// if the autoplay is set to true, then reset the interval

						if (autoplay=="true") {
							clearInterval(interval);
							interval = setInterval(function(){ init() ; }, speed);
						}

						// move the playhead forward
						
						highestZ++ ;				
						currentSlide++ ;

					}
				}

			}

			// return the object		

			return elementObject ;

		}
    });
})(jQuery);



