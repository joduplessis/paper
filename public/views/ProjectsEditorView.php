<!DOCTYPE html>
<html lang="en">

	<head>

		<title>Paper</title>

		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">

		<!-- 3rd party tools -->

		<link rel="stylesheet" href="<?php echo APP_ROOT; ?>/bower_components/jquery-ui/themes/base/jquery-ui.css" />

		<script src="<?php echo APP_ROOT; ?>/bower_components/jquery/dist/jquery.js"></script>
		<script src="<?php echo APP_ROOT; ?>/bower_components/jquery-ui/jquery-ui.js"></script>
		<script src="<?php echo APP_ROOT; ?>/bower_components/iscroll/build/iscroll-zoom.js"></script>

		<!-- Paper styles -->

		<link rel="stylesheet/less" type="text/css" href="<?php echo SITE_ROOT; ?>/css/editor.less" />
		<link rel="stylesheet/less" type="text/css" href="<?php echo SITE_ROOT; ?>/css/objects.less" />

		<!-- Paper scripts -->

		<script>

			var PROJECT_ID = <?=$this->e($project['id'])?>;
			var PROJECT_HEIGHT = <?=$this->e($project['height'])?>;
			var PROJECT_WIDTH = <?=$this->e($project['width'])?>;
			var PROJECT_IMAGES = "<?=$this->e($project['images'])?>";
			var PROJECT_PAGES = <?=$this->e($project['pages'])?>;
			var SITE_URL = "<?php echo SITE_ROOT; ?>";

		</script>

		<script src="<?php echo SITE_ROOT; ?>/js/editor.js"></script>
		<script src="<?php echo SITE_ROOT; ?>/js/events.js"></script>
		<script src="<?php echo SITE_ROOT; ?>/js/widget.gizmo.js"></script>
		<script src="<?php echo SITE_ROOT; ?>/js/widget.html.js"></script>
		<script src="<?php echo SITE_ROOT; ?>/js/widget.image.js"></script>
		<script src="<?php echo SITE_ROOT; ?>/js/widget.video.js"></script>
		<script src="<?php echo SITE_ROOT; ?>/js/widget.slideshow.js"></script>
		<script src="<?php echo SITE_ROOT; ?>/js/widget.sequence.js"></script>

		<!-- LESS -->

    <script src="<?php echo APP_ROOT; ?>/bower_components/less/dist/less.min.js"></script>

	</head>

	<body>

		<!-- Popup -->

		<div id="ui popup" class="ui popup">
			<div class="content" id="content">
				<a href="javascript:void(0)" class="add">Add New Event</a>
				<a href="javascript:void(0)" class="update">Update Event</a>
				<a href="javascript:void(0)" class="delete">Delete Event</a>
				<a href="javascript:void(0)">|</a>
				<a href="javascript:void(0)" class="updateimages">Update Object Images</a>
				<a href="javascript:void(0)">|</a>
				<a href="javascript:void(0)" class="close">Close Window</a>
			</div>
		</div>

		<!-- Toolbar -->

		<div id="ui tools" class="ui tools">
			<ul>
				<li><a href="javascript:void(0)" id="gizmo"><img src="<?php echo SITE_ROOT; ?>/images/gizmo.png" border="0" alt="Gizmo"/></a></li>
				<li><a href="javascript:void(0)" id="html"><img src="<?php echo SITE_ROOT; ?>/images/html.png" border="0" alt="HTML"/></a></li>
				<li><a href="javascript:void(0)" id="video"><img src="<?php echo SITE_ROOT; ?>/images/video.png" border="0" alt="Video"/></a></li>
				<li><a href="javascript:void(0)" id="image"><img src="<?php echo SITE_ROOT; ?>/images/image.png" border="0" alt="Image"/></a></li>
				<li><a href="javascript:void(0)" id="slideshow"><img src="<?php echo SITE_ROOT; ?>/images/slideshow.png" border="0" alt="Slideshow"/></a></li>
				<li><a href="javascript:void(0)" id="sequence"><img src="<?php echo SITE_ROOT; ?>/images/sequence.png" border="0" alt="Sequence"/></a></li>
			</ul>
		</div>

		<!-- Controls -->

		<div id="ui controls" class="ui controls">
			<a href="javascript:void(0)" class="add">Add Page</a>
			<a href="javascript:void(0)" class="save">Save Page</a>
			<a href="javascript:void(0)" class="export" target="_blank">Publish Catalogue</a>
			<a href="javascript:void(0)">|</a>
			<a href="javascript:void(0)" class="delete">Delete Object</a>
			<a href="javascript:void(0)" class="ungroup">Ungroup Object</a>
			<a href="javascript:void(0)" class="copy">Copy Object</a>
			<a href="javascript:void(0)">|</a>
			<a href="javascript:void(0)" class="record-start">Start Recording</a>
			<a href="javascript:void(0)" class="record-stop">Stop Recording</a>
			<a href="javascript:void(0)" class="play">Play Recording</a>
		</div>

		<!-- Settings -->

		<div id="ui attributes" class="ui attributes first">
			<div id="accordion" class="accordion">
				<h3>Properties</h3>
				<div class="properties"><ul></ul></div>
			</div>
			<div id="accordion" class="accordion">
				<h3>Styles</h3>
				<div class="styles"><ul></ul></div>
			</div>
			<div id="accordion" class="accordion">
				<h3>Animations</h3>
				<div class="events"><ul></ul></div>
			</div>
		</div>

		<div id="ui attributes" class="ui attributes second">
			<div id="accordion" class="accordion">
				<h3>Pages</h3>
				<div class="pages"><ul></ul></div>
			</div>
			<div class="accordion" id="accordion">
				<h3>Objects</h3>
				<div class="layers"><ul></ul></div>
			</div>
		</div>

		<!-- Actual page -->

		<div 	data-type="page"
					data-page="1"
					data-page-title="This is a page title"
					id="canvas"
					data-event-on-pageload=""
					style="width: <?=$this->e($project['width'])?>px !important; height: <?=$this->e($project['height'])?>px !important;"></div>

	</body>

</html>
