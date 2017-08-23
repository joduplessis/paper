'user strict';

var selectedObject, selectedObjectStyles, selectedObjectStylesToAnimate ;
var selectedPage = 0 ;
var canvas, canvasWidth, canvasHeight ;
var popup, popupContent, eventObject, eventPlayID ;
var propertiesList, eventsList, stylesList, pagesList ;
var mode = 'edit' ;
var exportHTML  ;
var isRecording = false  ;
var uniqueEventCounter = 0 ;
var uniqueObjectCounter = 0 ;
var eventRegistry = [] ;
var totalPages = PROJECT_PAGES ;

jQuery.support.cors = true;

$(document).ready(function() {

	// get the main canvas object
	canvas = $('#canvas') ;

	// set the first page up
	canvas.attr('data-page', $(this).find('span').html());
	canvas.attr('data-page-title', 'None');
	canvas.attr('data-event-on-pageload', 'pageload');

	// get the dimensions
	canvasWidth = canvas.innerWidth();
	canvasHeight = canvas.innerHeight();

	// here we get some of the ui
	popup = $('.ui.popup') ;
	popupContent = $('.ui.popup .content') ;
	eventsList = $('.attributes .events ul') ;
	propertiesList = $('.attributes .properties ul') ;
	stylesList = $('.attributes .styles ul') ;
	layersList = $('.attributes .layers ul') ;
	pagesList = $('.attributes .pages ul') ;

	// make the accordion
  $('.accordion').accordion({
		heightStyle: "content",
		collapsible: true
	});

	// add the page list - read only for now
	$.ajax({
			url: SITE_URL+'/projects/'+PROJECT_ID+'/pages',
			type: 'POST',
			success: function(result) {
				var pagesArray = result.split(",");
				for (var pages = 0 ; pages < pagesArray.length ; pages++) {
					pagesList.append('<li>Page '+(pages+1)+'<span>'+pagesArray[pages]+'</span></li>');
				}
				initTools() ;
				initUIEvents() ;
			}
	});




});








// open the event window

function openEvent(id) {

	// get the event object

	$.each(eventRegistry, function(name, value) {
		if (value.event.unique == id) {

			// assign the event array to the object

			eventObject = value.event ;

			// add the event name as the id

			$('.ui.popup a.delete').attr('id', value.event.unique);
			$('.ui.popup a.update').attr('id', value.event.unique);

		}
	});

	// create the fields

	var eventList = $('<ul></ul>');

	$.each(eventObject, function(name, value) {

		if (value.constructor != Object) {
			eventList.append('<li><label>'+name+'</label><input type="text" class="'+name+'" value="'+value+'"></li>');
		} else {

			// if there are sub properties on this list

			var eventSubList = $('<ul></ul>');

			$.each(value, function(sname, svalue) {
				eventSubList.append('<li><label>'+sname+'</label><input type="text" class="sub-'+sname+'" value="'+svalue+'"></li>');
			});

			// append the list

			eventSubList.appendTo(eventList);
		}

	});

	// prepend - because the buttons are there

	eventList.prependTo(popupContent);

	// fade in

	popup.fadeIn();

}

// delete the event

function deleteEvent(id) {

	// counter

	var index = 0 ;
	var indexToRemove ;

	// go through all of the objects

	$.each(eventRegistry, function(name, value) {

		// remove the array entry where the object id is the focus point object id - this needs to be reworked

		if ( value.event.unique==id ) { indexToRemove = index ; }

		// increate the count

		index++ ;

	});

	// remove the array entry

	if ( indexToRemove != undefined ) { eventRegistry.splice(indexToRemove, 1) };

	// re populate the events list

	initEvents() ;

	// close the window

	popup.fadeOut(function() { popupContent.find('ul').remove() ; });

}

// edit the event

function updateEvent(id,add) {

	// set up the JS objects

	var main = {} ;
	var properties = {} ;

	// main animation event details

	popupContent.find('input').each(function(){
		if ( $(this).attr('class').substring(0,4) != 'sub-') {
			main[ $(this).attr('class') ] = $(this).val() ;
		}
	});

	// main properties that are styles

	popupContent.find('input').each(function(){
		if ( $(this).attr('class').substring(0,4) == 'sub-') {
			properties[ $(this).attr('class').substring(4) ] = $(this).val() ;
		}
	});

	// assign the CSS properties to the main list

	main['properties'] = properties ;

	// first remove the event in the array - we're going to recreate it

	if (add==true) {
		deleteEvent(id) ;
	}

	// add the event to the array

	eventRegistry.push({ 'event': main });

	// re populate the events list

	initEvents() ;

	// close the window

	popup.fadeOut(function() { popupContent.find('ul').remove() ; });

}












// update the form

function populateUI(object) {

	// create the object

	selectedObject = object;

	// remove the selected class on everything

	canvas.find('div').each(function(i, obj) {
		$(obj).removeClass('selected-on-stage');
	});

	// add

	object.addClass('selected-on-stage');

	// empty the lists

	propertiesList.empty() ;
	stylesList.empty() ;

	// select the layer its on

    layersList.find('li').each(function(obj) {

    	$(this).removeClass('selected');

    	if (object.attr('data-unique')==$(this).attr('id')) {
    		$(this).addClass('selected');
    	}

    });

	// cycle through all of the atributes on this object and create the fields

	$.each(object[0].attributes, function(i, attrib) {

		var name = attrib.name;
		var value = attrib.value;

		// styles

		if ( name == 'style' ) {

			$.each(value.split(";"), function(i, sattrib) {

				var style = sattrib.split(':')[0].trim() ;
				var value = sattrib.split(':')[1] ;

				// we ignore these styles in the UI

				if ( style!='' && style!='position') {
					stylesList.append('<li><label>'+style+'</label><input type="text" class="'+style+'" value="'+value+'"></li>');
				}

			});

		}

		// data properties

		if (object.attr('data-type')!="image") {

			if ( name.substring(0,4) == 'data' ) { propertiesList.append('<li><label>'+name.substring(5)+'</label><input type="text" class="'+name+'" value="'+value+'"></li>'); }

		}

	});

	if (object.attr('data-type')=="image") {

		propertiesList.append('<li><label>unique</label><input type="text" class="data-unique" value="'+selectedObject.attr('data-unique')+'"></li>');
		propertiesList.append('<li><label>type</label><input type="text" class="data-type" value="'+selectedObject.attr('data-type')+'"></li>');
		propertiesList.append('<li><label>id / name</label><input type="text" class="data-id" value="'+selectedObject.attr('data-id')+'"></li>');
		propertiesList.append('<li><label>parallax</label><input type="text" class="data-parallax" value="'+selectedObject.attr('data-parallax')+'"></li>');
		propertiesList.append('<li><label>parallax step</label><input type="text" class="data-parallax-step" value="'+selectedObject.attr('data-parallax-step')+'"></li>');
		propertiesList.append('<li><label>zoom</label><input type="text" class="data-zoom" value="'+selectedObject.attr('data-zoom')+'"></li>');
		propertiesList.append('<li><label>scrollbars</label><input type="text" class="data-scrollbars" value="'+selectedObject.attr('data-scrollbars')+'"></li>');
		propertiesList.append('<li><label>src</label><input type="text" class="data-src" value="'+selectedObject.attr('data-src')+'"></li>');
		propertiesList.append('<li><label>ignore fadein</label><input type="text" class="data-ignore-fadein" value="'+selectedObject.attr('data-ignore-fadein')+'"></li>');
		propertiesList.append('<li><label>url</label><input type="text" class="data-url" value="'+selectedObject.attr('data-url')+'"></li>');
		propertiesList.append('<li><label>fade in slide</label><input type="text" class="data-fadein-slide" value="'+selectedObject.attr('data-fadein-slide')+'"></li>');
		propertiesList.append('<li><label>event on touch</label><input type="text" class="data-event-on-touch" value="'+selectedObject.attr('data-event-on-touch')+'"></li>');
		propertiesList.append('<li><label>event navigate on touch</label><input type="text" class="data-event-navigate-on-touch" value="'+selectedObject.attr('data-event-navigate-on-touch')+'"></li>');
		propertiesList.append('<li><label>fade in delay</label><input type="text" class="data-fadein-delay" value="'+selectedObject.attr('data-fadein-delay')+'"></li>');
		propertiesList.append('<li><label>toggle prices</label><input type="text" class="data-toggle-prices" value="'+selectedObject.attr('data-toggle-prices')+'"></li>');




	}

	// add the key listeners for if something changes

	stylesList.find('input').keyup(function() { updateObjectStylesOnUIChange() ; }) ;

	propertiesList.find('input').keyup(function() { updateObjectPropertiesOnUIChange() ; }) ;
	propertiesList.find('input.data-src').on('click', function() { imagePopup($(this)) ; }) ;

}

// edit the styles

function updateObjectStylesOnUIChange() {

	// remove the toggled class to make the animation run from the start

	selectedObject.removeClass('toggled');

	// find all the inputs

	stylesList.find('input').each(function(){
		selectedObject.css( $(this).attr('class'), $(this).val() ) ;
	});

	// set the toggle styles - but only if the position is not recording

	if ( !isRecording ) { selectedObject.attr('style-toggle', selectedObject.attr('style') ) ; }

}

// edit the properties

function updateObjectPropertiesOnUIChange() {

	// remove the interactive part

	selectedObject.draggable( "destroy" );
	selectedObject.resizable( "destroy" );
	selectedObject.droppable( "destroy" );

	// re-assign the properites

	propertiesList.find('input').each(function(){
		selectedObject.attr( $(this).attr('class'), $(this).val() ) ;
	});

	// recreate the list of layers

	layersList.find('li').each(function(){
		if ( $(this).attr('id') == selectedObject.attr('data-unique') ) {
			$(this).html( selectedObject.attr('data-id') );
		}
	});

	// re-create elements

	switch( selectedObject.attr('data-type') ) {
		case 'gizmo': 		selectedObject.paperGizmo(mode); 		break;
		case 'html': 		selectedObject.paperHTML(mode); 		break;
		case 'image': 		selectedObject.paperImage(mode); 		break;
		case 'video': 		selectedObject.paperVideo(mode); 		break;
		case 'slideshow': 	selectedObject.paperSlideshow(mode); 	break;
		case 'sequence': 	selectedObject.paperSequence(mode); 	break;
	}

	// controls

	selectedObject.append('<div class="ui-resizable-handle ui-resizable-nw" id="nwgrip"></div>');
	selectedObject.append('<div class="ui-resizable-handle ui-resizable-ne" id="negrip"></div>');
	selectedObject.append('<div class="ui-resizable-handle ui-resizable-sw" id="swgrip"></div>');
	selectedObject.append('<div class="ui-resizable-handle ui-resizable-se" id="segrip"></div>');
	selectedObject.append('<div class="ui-resizable-handle ui-resizable-n" id="ngrip"></div>');
	selectedObject.append('<div class="ui-resizable-handle ui-resizable-s" id="sgrip"></div>');
	selectedObject.append('<div class="ui-resizable-handle ui-resizable-e" id="egrip"></div>');
	selectedObject.append('<div class="ui-resizable-handle ui-resizable-w" id="wgrip"></div>');

	// make it interactive

	makeObjectInteractive( selectedObject );

}

// here we save all changes from the movement

function updateUIFromStageChange() {

	// set the toggle styles - but only if the position is not recording

	if ( !isRecording ) { selectedObject.attr('style-toggle', selectedObject.attr('style') ) ; }

	// remove the toggled class to make the animation run from the start

	selectedObject.removeClass('toggled');

	// cycle through all of the atributes on this object and create the fields

	$.each(selectedObject[0].attributes, function(i, attrib) {

		var name = attrib.name;
		var value = attrib.value;

		// styles

		if ( name == 'style' ) {
			$.each(value.split(";"), function(i, sattrib) {

				var style = sattrib.split(':')[0].trim() ;
				var value = sattrib.split(':')[1] ;

				// we ignore these styles in the UI

				if ( style!='' && style!='position') { $('input.'+style).val(value); }

			});
		}

	});

}






// images

function imagePopup(object) {

	var imagePopupContent = "<ul>";

	for (var c=0; c<PROJECT_IMAGES.split(',').length; c++) {
		var filename = SITE_URL+"/assets/"+PROJECT_IMAGES.split(',')[c];
		imagePopupContent += "<li style='width:100px;height:150px;float:left;margin:5px;text-align:center;padding: 0px;border:none;cursor: pointer !important; overflow: hidden; display:block;'><img src='"+filename+"' border='0'/></li>";
	}

	imagePopupContent += "</ul>";

	popupContent.append(imagePopupContent);

	popupContent.find('li').on('click', function() {
		$(this).toggleClass('selected') ;
	}) ;

	popup.fadeIn();

}











// add the draggable & rezable stuff

function makeObjectInteractive(object) {

	object.draggable({ snap: true });

	object.droppable({ hoverClass: "ui-state-paperhover", drop: function( event, ui ) { moveObjectToGizmo( $(this),$(ui.draggable) ) ; } });

	object.resizable({
		aspectRatio: true,
		handles: {
	        'nw': '#nwgrip',
	        'ne': '#negrip',
	        'sw': '#swgrip',
	        'se': '#segrip',
	        'n': '#ngrip',
	        'e': '#egrip',
	        's': '#sgrip',
	        'w': '#wgrip'
    	}, resize: function( event, ui ) { updateUIFromStageChange() ; } });

	object.on("drag", function( event, ui ) { updateUIFromStageChange() ; });

	object.on("mousedown", function( event, ui ) {

		if ( $(event.target.offsetParent).attr('data-type')!= 'page') {
			selectedObject = $(event.target.offsetParent) ;
		} else {
			selectedObject = $(event.target) ;
		}

		populateUI(selectedObject) ;

	});

}

// moves the object into the gizmo

function moveObjectToGizmo(dockObject, droppedObject) {

	if ( dockObject.attr('data-type')=='gizmo' ) {
		droppedObject.appendTo(dockObject);
	}

	populateUI(droppedObject) ;

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













// object initializing - we make it interactive & add a new layer

function initObject(object) {

	object.attr('data-unique', new Date().getTime()) ;

	// make the object

	switch( object.attr('data-type') ) {
		case 'gizmo': 		object.paperGizmo( mode ); 		break;
		case 'html': 		object.paperHTML( mode ); 		break;
		case 'image': 		object.paperImage( mode ); 		break;
		case 'video': 		object.paperVideo( mode ); 		break;
		case 'slideshow': 	object.paperSlideshow( mode ); 	break;
		case 'sequence': 	object.paperSequence( mode ); 	break;
	}

	// controls

	object.append('<div class="ui-resizable-handle ui-resizable-nw" id="nwgrip"></div>');
	object.append('<div class="ui-resizable-handle ui-resizable-ne" id="negrip"></div>');
	object.append('<div class="ui-resizable-handle ui-resizable-sw" id="swgrip"></div>');
	object.append('<div class="ui-resizable-handle ui-resizable-se" id="segrip"></div>');
	object.append('<div class="ui-resizable-handle ui-resizable-n" id="ngrip"></div>');
	object.append('<div class="ui-resizable-handle ui-resizable-s" id="sgrip"></div>');
	object.append('<div class="ui-resizable-handle ui-resizable-e" id="egrip"></div>');
	object.append('<div class="ui-resizable-handle ui-resizable-w" id="wgrip"></div>');

	// make it interactive

	makeObjectInteractive(object) ;

	// add a new layer

	layersList.append('<li id="'+object.attr('data-unique')+'">'+object.attr('data-id')+'</li>') ;

}

// set up the canvas contents

function initObjectsOnStage() {

	propertiesList.empty();
	stylesList.empty();
	layersList.empty();

	canvas.find('div').each(function(index, object) { initObject($(object)); uniqueObjectCounter++; });

}

// populate the events

function initEvents() {

	// empty the list

	eventsList.empty() ;

	// populate the touch events ARRAY

	$.each(eventRegistry, function(name, value) {
		eventsList.append('<li id="'+value.event.unique+'" data-event-id="'+value.event.id+'">'+value.event.id+'<span>'+value.event.type+'</span></li>');
		uniqueEventCounter++;
	});

	// now listen for any key movements

	eventsList.find('li').on('dblclick', function() { openEvent( $(this).attr('id') ); }) ;
	eventsList.find('li').on('click', function() {

		eventsList.find('li').removeClass('selected') ;
		$(this).addClass('selected') ;
		eventPlayID = $(this).attr('data-event-id') ;

	}) ;

}

// ui tools

function initTools() {

	$( ".tools a").on('click', function(object) {

		uniqueObjectCounter++ ;

		var newObject = $('<div></div>');
		var newObjectType = $(this).attr('id');

		// add default styles

		newObject.css({

			'left':'0px',
			'top':'0px',
			'width':'200px',
			'height':'200px',
			'opacity':'1',
			'border-width':'0px',
			'border-color':'#ffffff',
			'border-radius':'0px',
			'z-index':'0',
			'background-color':'transparent',
			'visibility':'visible',
			boxShadow:'0px 0px 0px 0px #000000'

		}) ;

		// add the object default atrtibutes

		switch ( newObjectType ) {

			case 'image':
				newObject.attr('data-unique',uniqueObjectCounter);
				newObject.attr('data-type','image');
				newObject.attr('data-id','image'+uniqueObjectCounter);
				newObject.attr('data-parallax','false');
				newObject.attr('data-parallax-step','0.2');
				newObject.attr('data-zoom','false');
				newObject.attr('data-scrollbars','true');
				newObject.attr('data-src','media/plain.jpg');
				newObject.attr('data-event-on-touch','none');
				newObject.attr('data-ignore-fadein','true');
				newObject.attr('data-url','');
				newObject.attr('data-fadein-slide','false');
				newObject.attr('data-event-navigate-on-touch','none');
				newObject.attr('data-fadein-delay','0');
				newObject.attr('data-toggle-prices','false');
				break;

			case 'html':
				newObject.attr('data-unique',uniqueObjectCounter);
				newObject.attr('data-type','html');
				newObject.attr('data-id','html'+uniqueObjectCounter);
				newObject.attr('data-parallax','false');
				newObject.attr('data-parallax-step','0.2');
				newObject.attr('data-content','This is a HTML widget.');
				newObject.attr('data-event-on-touch','none');
				newObject.attr('data-ignore-fadein','true');
				newObject.attr('data-fadein-slide','false');
				newObject.attr('data-event-navigate-on-touch','none');
				newObject.attr('data-fadein-delay','0');
				break;

			case 'video':
				newObject.attr('data-unique',uniqueObjectCounter);
				newObject.attr('data-type','video');
				newObject.attr('data-id','video'+uniqueObjectCounter);
				newObject.attr('data-parallax','false');
				newObject.attr('data-parallax-step','0.2');
				newObject.attr('data-controls','true');
				newObject.attr('data-autoplay','false');
				newObject.attr('data-loop','false');
				newObject.attr('data-src','media/colab.mp4');
				newObject.attr('data-event-on-touch','none');
				newObject.attr('data-event-on-video-ended','none');
				newObject.attr('data-event-on-video-play','none');
				newObject.attr('data-event-on-video-pause','none');
				newObject.attr('data-ignore-fadein','true');
				newObject.attr('data-fadein-slide','false');
				newObject.attr('data-event-navigate-on-touch','none');
				newObject.attr('data-fadein-delay','0');
				break;

			case 'gizmo':
				newObject.attr('data-unique',uniqueObjectCounter);
				newObject.attr('data-type','gizmo');
				newObject.attr('data-id','gizmo'+uniqueObjectCounter);
				newObject.attr('data-parallax','false');
				newObject.attr('data-parallax-step','0.2');
				newObject.attr('data-scrollable','true');
				newObject.attr('data-scrollbars','true');
				newObject.attr('data-pagination-vertical','false');
				newObject.attr('data-pagination-vertical-offset','10');
				newObject.attr('data-pagination-horizontal','false');
				newObject.attr('data-pagination-horizontal-offset','10');
				newObject.attr('data-event-on-touch','none');
				newObject.attr('data-ignore-fadein','true');
				newObject.attr('data-fadein-slide','false');
				newObject.attr('data-event-navigate-on-touch','none');
				newObject.attr('data-fadein-delay','0');
				newObject.attr('data-scrape-url','');
				break;


			case 'slideshow':
				newObject.attr('data-unique',uniqueObjectCounter);
				newObject.attr('data-type','slideshow');
				newObject.attr('data-id','slideshow'+uniqueObjectCounter);
				newObject.attr('data-parallax','false');
				newObject.attr('data-parallax-step','0.2');
				newObject.attr('data-autoplay','true');
				newObject.attr('data-loop','0');
				newObject.attr('data-pagination','true');
				newObject.attr('data-pagination-offset','30');
				newObject.attr('data-fade','1250');
				newObject.attr('data-speed','2000');
				newObject.attr('data-style','slide');
				newObject.attr('data-src','media/plain.jpg,media/plain1.jpg,media/plain2.jpg');
				newObject.attr('data-event-on-touch','none');
				newObject.attr('data-event-on-slidehow-complete','none');
				newObject.attr('data-ignore-fadein','true');
				newObject.attr('data-fadein-slide','false');
				newObject.attr('data-event-navigate-on-touch','none');
				newObject.attr('data-fadein-delay','0');
				break;

			case 'sequence':
				newObject.attr('data-unique',uniqueObjectCounter);
				newObject.attr('data-type','sequence');
				newObject.attr('data-id','sequence'+uniqueObjectCounter);
				newObject.attr('data-parallax','false');
				newObject.attr('data-parallax-step','0.2');
				newObject.attr('data-pagination','true');
				newObject.attr('data-pagination-offset-top','70');
				newObject.attr('data-pagination-offset-side','10');
				newObject.attr('data-src','media/plain.jpg,media/plain1.jpg,media/plain2.jpg');
				newObject.attr('data-event-on-touch','none');
				newObject.attr('data-fadein-slide','false');
				newObject.attr('data-event-navigate-on-touch','none');
				newObject.attr('data-ignore-fadein','true');
				newObject.attr('data-fadein-delay','0');
				break;

		}

		// add the new object to the canvas

		newObject.appendTo( canvas ) ;

		initObject(newObject) ;

	}) ;

}

// set up the page

function initPage(page) {

	if (page!=0) {

		selectedPage = page;

		pagesList.find('li').each(function() {
			// Remove all of the selected styles
			$(this).removeClass('selected');
			// If the page id = the selected page
			if (selectedPage == $(this).find('span').html()) {
				// Add the selected class
				$(this).addClass('selected');
				// Change this attribute on the actual age
				canvas.attr('data-page', $(this).find('span').html());
				canvas.attr('data-page-title', 'None');
				// Reset these
				uniqueEventCounter = 0 ;
				uniqueObjectCounter = 0 ;
			}
		});

		// set up the new contents
		$.ajax({
				url: SITE_URL+'/pages/'+page+'/objects',
				type: 'POST',
				success: function(result) {
					canvas.html( $(result).html() ) ;
					initObjectsOnStage() ;
				}
		});

		// set up the new events
		$.ajax({
				url: SITE_URL+'/pages/'+page+'/events',
				type: 'POST',
				success: function(result) {
				 	eventRegistry = $.parseJSON(result) ;
					initEvents() ;
				}
		});

	}

}

// ui clicks

function initUIEvents() {

	// page clicks
  pagesList.find('li').on('click', function() {
		selectedPage = $(this).find('span').html() ;
		initPage(selectedPage) ;
  });

  // make the layers click
  $('.attributes .layers ul').on('click', function(obj) {
  	$('.attributes .layers ul li').removeClass('selected') ;
  	$(obj.toElement).addClass('selected');
  	populateUI( $('div[data-id="'+$(obj.toElement).html()+'"]') ) ;
  });

  // close the event window
  $('.ui.popup a.close').on('click', function() {
  	popup.fadeOut(function() {
			popupContent.find('ul').remove() ;
			popupContent.find('textarea').remove() ;
  	});
  });

  // add a new event
  $('.ui.popup a.add').on('click', function() {
  	updateEvent( $(this).attr('id'), false );
  });

  // update the event
  $('.ui.popup a.update').on('click', function() {
  	updateEvent($(this).attr('id'), true);
  });

  // delete the current event
  $('.ui.popup a.delete').on('click', function() {
  	deleteEvent($(this).attr('id'));
  });

	// update images
  $('.ui.popup a.updateimages').on('click', function() {

  	var imageList = new Array() ;
  	var width, height ;
		popupContent.find('li').each(function(index, object) {
			if ($(this).hasClass("selected")) {
				imageList.push($(this).find('img').attr('src')) ;
				width = $(this).attr('data-width') + 'px' ;
				height = $(this).attr('data-height') + 'px' ;
			}
		});
		propertiesList.find('input.data-src').val(imageList.join(','));
		stylesList.find('input.width').val(width);
		stylesList.find('input.height').val(height);
		updateObjectPropertiesOnUIChange();
		updateObjectStylesOnUIChange();
  	popup.fadeOut(function() {
			popupContent.find('ul').remove() ;
			popupContent.find('textarea').remove() ;
  	});

  });

  // delete the object
  $('.ui.controls a.delete').on('click', function() {
		propertiesList.empty() ;
		stylesList.empty() ;
		layersList.find('li').each(function(index, object) {
			if (selectedObject.attr('data-id')==$(this).html()) {
				$(this).remove();
			}
		});
		selectedObject.remove() ;
  });

	// Add page
	$('.ui.controls a.add').on('click', function() {
		$.ajax({
		    url: SITE_URL+'/pages/add',
		    type: 'POST',
		    data: {
					objects: "",
					events: "",
		    	project: PROJECT_ID
		    },success: function(result) {
					$.ajax({
					    url: SITE_URL+'/pages/'+result+'/update',
					    type: 'POST',
					    data: {
								objects: '<div data-type="page" data-page="'+result+'" data-page-title="None" id="canvas" data-event-on-pageload="pageload"></div>',
								events: "[]",
					    	project: PROJECT_ID
					    },success: function(result) {
								pagesList.append('<li>Page '+result+'<span>'+result+'</span></li>');
					    }
					});
		    }
		});
  });

  // remove object from gizmo
  $('.ui.controls a.copy').on('click', function() {

  	uniqueObjectCounter++ ;

  	var selectedObjectClone = selectedObject.clone() ;

  	selectedObjectClone.attr('data-unique', uniqueObjectCounter);
  	selectedObjectClone.attr('data-id', selectedObject.attr('data-id') + '-' + uniqueObjectCounter);

		selectedObjectClone.appendTo( canvas ) ;

		initObject(selectedObjectClone) ;

  });

  // remove object from gizmo
  $('.ui.controls a.ungroup').on('click', function() {

  	selectedObject.appendTo(canvas);

  });

  // save
  $('.ui.controls a.save').on('click', function() {

		// empty the object
		exportHTML = canvas.clone() ;
		exportHTML.find('div').each(function(index, object) {
			$(this).removeClass() ;
			if ($(this).attr('data-type')!='gizmo') {
				$(this).empty();
			} else {
				$(this).find('.ui-resizable-handle').remove() ;
				$(this).find('#pagination-vertical').remove() ;
				$(this).find('#pagination-horizontal').remove() ;
			}
		});

		// Save the details
		setTimeout(function() {
			$.ajax({
		    url: SITE_URL+'/pages/'+selectedPage+'/update',
		    type: 'POST',
		    data: {
					objects: exportHTML.wrap('<p/>').parent().html(),
					events: JSON.stringify(eventRegistry)
		    },success: function(result) {
					console.log(result);
		    }
			});
		}, 200) ;

  });

	// export
  $('.ui.controls a.export').on('click', function() {

  	$(this).attr('href', SITE_URL+'/projects/'+PROJECT_ID+'/publish');

  });

  // play the animation
  $('.ui.controls a.play').on('click', function() {
		$.each(eventRegistry, function(name, value) {
			if (eventPlayID == value.event.id) {
				setTimeout(function() {

					var elementObject = $('div[data-id="'+value.event.object+'"]') ;
					var duration = value.event.duration ;
					var ease = value.event.ease ;
					var toggle = value.event.toggle ;
					var callback = value.event.callback ;
					var properties = value.event.properties ;

					// animate the css

					elementObject.css({'z-index': value.event.properties['z-index']});

					elementObject.animate(value.event.properties, Number(duration), ease, function() {

						elementObject.css( createCSSJSON( elementObject.attr('style-toggle') ) ) ;

					}) ;

				}, value.event.delay);
			}
		});
  });

  // record start
  $('.ui.controls a.record-start').on('click', function() {

  	// set the stage to recording

  	isRecording = true ;

		// set the toggle styles

		selectedObject.attr('style-toggle', selectedObject.attr('style') ) ;

		// add the recoridng class

    canvas.addClass('recording') ;

  	selectedObjectStyles = createCSSJSON( selectedObject.attr('style') );

  });

  // record stop & create an animation event
  $('.ui.controls a.record-stop').on('click', function() {

  	uniqueEventCounter++ ;

  	isRecording = false ;

  	// remove the recording outline

  	canvas.removeClass('recording') ;

  	// store the animated styles

  	selectedObjectAnimatedStyles = createCSSJSON( selectedObject.attr('style') );

  	// animate back to the original

  	selectedObject.animate( selectedObjectStyles );

  	// add the new animation event

		eventRegistry.push({

			'event': {

				'unique': uniqueEventCounter,
				'id': 'new-event-animation-'+uniqueEventCounter,
				'type': 'animation',
				'delay': 0,
				'object': selectedObject.attr('data-id'),
				'duration': 2500,
				'ease': 'easeOutCubic',
				'toggle': true,
				'callback': 'none',
				'properties': selectedObjectAnimatedStyles

			}

		});

		// re-populate events

		initEvents() ;

  });

}
