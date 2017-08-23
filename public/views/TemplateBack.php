<!DOCTYPE html>
<html>
  <head>

    <meta charset="UTF-8" />
    <meta description="" />
    <meta keywords="" />
    <meta author="" />
    <meta name="viewport" content="width=device-width, intial-scale=1" />

    <title>Paper</title>

    <link rel="shortcut icon" type="image/x-icon" href="">
    <link rel="stylesheet" type="text/css" href="<?php echo APP_ROOT; ?>/bower_components/bootstrap/dist/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="<?php echo APP_ROOT; ?>/bower_components/summernote/dist/summernote.css">
    <link rel="stylesheet" type="text/css" href="<?php echo APP_ROOT; ?>/bower_components/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet/less" type="text/css" href="<?php echo SITE_ROOT; ?>/css/styles.less">

    <script src="<?php echo APP_ROOT; ?>/bower_components/jquery/dist/jquery.min.js"></script>
    <script src="<?php echo APP_ROOT; ?>/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="<?php echo APP_ROOT; ?>/bower_components/less/dist/less.min.js"></script>
    <script src="<?php echo APP_ROOT; ?>/bower_components/summernote/dist/summernote.min.js"></script>
    <script src="<?php echo SITE_ROOT; ?>/js/custom.js"></script>

  </head>

  <body>
    <ol class="breadcrumb">
      <li><a href="javascript:window.history.back()">Go back</a></li>
    </ol>
    <?=$this->section('content')?>
  </body>

</html>
