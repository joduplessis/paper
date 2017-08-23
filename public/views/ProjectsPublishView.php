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

		<link rel="stylesheet/less" type="text/css" href="<?php echo SITE_ROOT; ?>/css/engine.less" />
		<link rel="stylesheet/less" type="text/css" href="<?php echo SITE_ROOT; ?>/css/objects.less" />

		<!-- Paper scripts -->

		<script>

			var PROJECT_ID = <?=$this->e($project['id'])?>;
			var PROJECT_HEIGHT = <?=$this->e($project['height'])?>;
			var PROJECT_WIDTH = <?=$this->e($project['width'])?>;
			var PROJECT_IMAGES = "<?=$this->e($project['images'])?>";
			var SITE_URL = "<?php echo SITE_ROOT; ?>";

		</script>

		<script src="<?php echo SITE_ROOT; ?>/js/engine.js"></script>
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
	<center>

	<div class="catalogue">

		<div data-type="paper" id="paper" style="width: <?=$this->e($project['width'])?>px !important; height: <?=$this->e($project['height'])?>px !important;">
		<?php foreach($project['pages'] as $page): ?>
			<?php echo $page['objects']; ?>
    <?php endforeach ?>
		</div>

		<a href="#" class="arrow-right"><img src="<?php echo SITE_ROOT; ?>/images/arrow_left.png" border="0"/></a>
		<a href="#" class="arrow-left"><img src="<?php echo SITE_ROOT; ?>/images/arrow_right.png" border="0"/></a>

	</div>
	</center>
	</body>

</html>
