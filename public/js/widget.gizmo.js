(function($) {
    $.fn.extend({
		paperGizmo: function(options) {

			var elementObject = this ; 
			var elementObjectInnerHTML = elementObject.html();
			var elementObjectID = this.attr('data-id') ;
			var elementObjectIDScroll = '.'+elementObjectID ;
			var scrollable = elementObject.attr('data-scrollable') ;
			var scrapeURL = elementObject.attr('data-scrape-url') ;
			var tempHTML = "" ;

	

			// dimensions

			var contentsHeight = 0;
			var contentsHeightTemp = 0;
			var actualHeight = elementObject.outerHeight() ;

			var contentsWidth = 0;
			var contentsWidthTemp = 0;
			var actualWidth = elementObject.outerWidth() ;

			// paralax indicators

			var indicators = new Array() ; 

			// pagniation variables

			var paginationVertical = 0;
			var paginateVertical = elementObject.attr('data-pagination-vertical'); 
			var paginationElementVertical = $('<div id="pagination-vertical"></div>');
			var paginationElementOffsetVertical = Number(elementObject.attr('data-pagination-vertical-offset'));;

			var paginationElementOffsetHorizontal = Number(elementObject.attr('data-pagination-horizontal-offset'));;
			var paginationElementHorizontal= $('<div id="pagination-horizontal"></div>');
			var paginateHorizontal = elementObject.attr('data-pagination-horizontal');  
			var paginationHorizontal = 0;

			var currentX = currentY = 0;

			// scrolling

			var scrollable = false ;
			var scrollbars = false ;

			if ( elementObject.attr('data-scrollable') == 'true' ) { scrollable = true; }
			if ( elementObject.attr('data-scrollbars') == 'true' ) { scrollbars = true; }

			// add class

			elementObject.attr('class', elementObjectID) ;	

			// scroll the position from outside

			$.fn.scrollPosition = function(x,y) { myScroll.scrollTo( x, y, 1000, IScroll.utils.ease.circular); };

			// wait for the page to process

			
















				// if there is some scraping to do

				if ( scrapeURL!=undefined && scrapeURL!='none' && scrapeURL!='' && options!='edit' ) {
					$.ajax({
						url: "scraper.php?url="+scrapeURL,
						dataType: 'text',
						success: function(data) {

							$(data).each(function(index, object){
							$(object).removeClass();
							$(object).find('a').attr('onclick','').unbind('click');
								elementObject.append( $(object).html() );
							});

							getContentDimensions();
							wrapHTML();
							activateScrolling();

						}
					});
				} 

				// if there is no scraping

				if ( ( scrapeURL==undefined || scrapeURL=='none' || scrapeURL=='' ) && options!='edit' ) {

					getContentDimensions();
					wrapHTML();
					activateScrolling();

				}










				// compute the total contents height & width

				function getContentDimensions() {
					setTimeout(function(){

						elementObject.find('div').each(function(){

							contentsHeightTemp = $(this).position().top + $(this).outerHeight(); 
							contentsWidthTemp = $(this).position().left + $(this).outerWidth(); 

							if ( contentsHeightTemp > contentsHeight ) { contentsHeight = contentsHeightTemp; }
							if ( contentsWidthTemp > contentsWidth ) { contentsWidth = contentsWidthTemp; }

						}) ; 

						elementObject.find('a').each(function(){

							contentsHeightTemp = $(this).position().top + $(this).outerHeight(); 
							contentsWidthTemp = $(this).position().left + $(this).outerWidth(); 

							if ( contentsHeightTemp > contentsHeight ) { contentsHeight = contentsHeightTemp; }
							if ( contentsWidthTemp > contentsWidth ) { contentsWidth = contentsWidthTemp; }

						}) ; 

						elementObject.find('span').each(function(){

							contentsHeightTemp = $(this).position().top + $(this).outerHeight(); 
							contentsWidthTemp = $(this).position().left + $(this).outerWidth(); 

							if ( contentsHeightTemp > contentsHeight ) { contentsHeight = contentsHeightTemp; }
							if ( contentsWidthTemp > contentsWidth ) { contentsWidth = contentsWidthTemp; }

						}) ; 
						elementObject.find('img').each(function(){

							contentsHeightTemp = $(this).position().top + $(this).outerHeight(); 
							contentsWidthTemp = $(this).position().left + $(this).outerWidth(); 

							if ( contentsHeightTemp > contentsHeight ) { contentsHeight = contentsHeightTemp; }
							if ( contentsWidthTemp > contentsWidth ) { contentsWidth = contentsWidthTemp; }

						}) ; 

						console.log(elementObject.attr('data-id')+' - '+contentsHeight);

					}, 500);
				}










				// if the gizmo is not in edit mode

				function wrapHTML() {
					setTimeout(function(){
						if ( options != 'edit' ) {
							tempHTML = elementObject.html() ;
							elementObject.html('<div style="width:'+contentsWidth+'px; height:'+contentsHeight+'px; position:absolute; top: 0px; left: 0px;" class="gizmo-container">'+tempHTML+'</div>' );
						}
					}, 550);

				}





				// if the gizmo is not in edit mode

				function activateScrolling() {
					setTimeout(function(){

						if ( options != 'edit' ) {

							if (scrollable) {

								var myScroll = new IScroll( elementObjectIDScroll , {
									scrollX: scrollable,
									scrollY: scrollable,
									mouseWheel: true,
									scrollbars: scrollbars,
									shrinkScrollbars: 'scale',
									indicators: indicators
								});

								// events for the pagination

								elementObject.find('#pagination-vertical a').on('click', function() {
									currentY = Number( $(this).attr('data-pos') ) * actualHeight * -1 ;
									myScroll.scrollTo( currentX, currentY, 1000, IScroll.utils.ease.circular);
								}) ;

								elementObject.find('#pagination-horizontal a').on('click', function() {
									currentX = Number( $(this).attr('data-pos') ) * actualHeight * -1 ;
									myScroll.scrollTo( currentX, currentY, 1000, IScroll.utils.ease.circular);
								}) ;

							}

							// redo events for touches

							elementObject.find('div').each(function(index, object) { 

								var paperObject = $(object);
								var paperObjectTouchEvent = paperObject.attr('data-event-on-touch') ;
								var paperObjectNavigateTouchEvent = paperObject.attr('data-event-navigate-on-touch') ;

								if ( paperObjectTouchEvent != undefined && paperObjectTouchEvent != 'none' && paperObjectTouchEvent != '') { paperObject.on('click', function(e){ paperEvent( paperObjectTouchEvent ); }) ; }
								if ( paperObjectNavigateTouchEvent != undefined && paperObjectNavigateTouchEvent != 'none' && paperObjectNavigateTouchEvent != '') { paperObject.on('click', function(){ positionPage( paperObjectNavigateTouchEvent ) ; }) ; }

							});

						}	

					}, 600);
				}











				/*

				// get the total amount of pagination elements

				paginationVertical = Math.round(contentsHeight/actualHeight);
				paginationHorizontal = Math.round(contentsWidth/actualWidth);

				// append the links into the actual pagination elements

				if ( paginationVertical>1 ) { for (var i=0;i<paginationVertical;i++) { paginationElementVertical.append('<a href="#" data-pos="'+i+'"></a>') ; } } 
				if ( paginationHorizontal>1 ) { for (var i=0;i<paginationHorizontal;i++) { paginationElementHorizontal.append('<a href="#" data-pos="'+i+'"></a>') ; } }

				// append the pagination

				if (paginateVertical=='true') {
					paginationElementVertical.css({'padding-top': paginationElementOffsetVertical});
					paginationElementVertical.appendTo(elementObject) ;
				}

				if (paginateHorizontal=='true') {
					paginationElementHorizontal.css({'padding-left': paginationElementOffsetHorizontal});
					paginationElementHorizontal.appendTo(elementObject) ;
				}

				*/

	 

			

			// return the object

			return elementObject ;

		}
    });
})(jQuery);



