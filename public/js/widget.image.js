(function($) {
    $.fn.extend({
		paperImage: function(options) {

			var elementObject = this ; 
			var elementObjectID = elementObject.attr('data-id') ;
			var elementObjectIDScroll = '.'+elementObjectID ;

			var scrollbars = false ;
			var zoom = false ;
			var url = "" ;
			var src = elementObject.attr('data-src') ;

			var myScroll ;

			// if there are scrollbars or not

			if ( elementObject.attr('data-scrollbars') == 'true' ) { scrollbars = true; }
			if ( elementObject.attr('data-zoom') == 'true' ) { zoom = true; }
			if ( elementObject.attr('data-url') != '' ) { url = elementObject.attr('data-url'); }

			// append the object

			if ( options=='live' && url != '' ) {
				elementObject.html('<a href="'+url+'" target="_blank"><img src="'+src+'" width="100%" height="100%" border="0"/></a>') ;
			} else {
				elementObject.html('<img src="'+src+'" width="100%" height="100%" border="0"/>') ;
			}

			

			// if there are scrollbars or not

			if ( elementObject.attr('data-scrollbars') == 'true' ) { scrollbars = true; }
			if ( elementObject.attr('data-zoom') == 'true' ) { zoom = true; }

			// add class

			elementObject.attr('class', elementObjectID) ;			

			// if its live

			if (options=='live' && zoom==true) {

				// wait for the DOM to be appended

				setTimeout(function(){
						
					myScroll = new IScroll( elementObjectIDScroll , {

						scrollX: true,
						scrollY: true,
						mouseWheel: true,
						scrollbars: scrollbars,
						wheelAction: 'zoom',
		    			zoom: true
		    			
					});

				}, 50);

			}

			// return the object		

			return elementObject ;

		}
    });
})(jQuery);



