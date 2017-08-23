(function($) {
    $.fn.extend({
		paperVideo: function(options) {

			var elementObject = this ; 
			var videoOptions = "";
			var videoSrc = elementObject.attr('data-src');	

			// create the parameters string

			if ( elementObject.attr('data-controls') == 'true' ) { videoOptions += 'controls '; }
			if ( elementObject.attr('data-autoplay') == 'true' ) { videoOptions += 'autoplay '; }
			if ( elementObject.attr('data-loop') == 'true' ) { videoOptions += 'loop '; }

			// append the video HTML% element

			elementObject.html( '<video '+videoOptions+' preload="auto"><source src="'+videoSrc+'" type="video/mp4"></video>' ) ;	
				
			elementObject.find('video').on("ended", function (e) { if ( elementObject.attr('data-event-on-video-ended')!=undefined ) { paperEvent( elementObject.attr('data-event-on-video-ended') ); } } );
			elementObject.find('video').on("play", function (e) { if ( elementObject.attr('data-event-on-video-play')!=undefined ) { paperEvent( elementObject.attr('data-event-on-video-play') ); } } );
			elementObject.find('video').on("pause", function (e) { if ( elementObject.attr('data-event-on-video-pause')!=undefined ) { paperEvent( elementObject.attr('data-event-on-video-pause') ); } } );

			// return the object			

			return elementObject ;

		}
    });
})(jQuery);



