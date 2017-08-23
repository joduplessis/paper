<?php $this->layout('Template') ?>

<!-- Container -->
<div class="panel panel-primary">
  <div class="panel-heading">
    <a href="<?php echo SITE_ROOT; ?>/projects/add" class="pull-right btn-primary">Add project</a>
    <h3 class="panel-title">Projects</h3>
  </div>
  <div class="panel-body">
    <!-- List of pages -->
    <ul class="media-list">
      <?php foreach($projects as $project): ?>
      <li class="media">
        <div class="media-body">
          <a href="<?php echo SITE_ROOT; ?>/projects/<?php echo $project['id']; ?>/delete" class="btn btn-danger pull-right" type="button" style="margin-right: 4px; " onClick="return confirm('Are you sure you want to delete?')">Delete</a>
          <a href="<?php echo SITE_ROOT; ?>/projects/<?php echo $project['id']; ?>/detail" class="btn btn-primary pull-right" type="button" style="margin-right: 4px; ">Details</a>
          <a href="<?php echo SITE_ROOT; ?>/projects/<?php echo $project['id']; ?>/editor" class="btn btn-primary pull-right" type="button" style="margin-right: 4px; " target="_blank">Editor</a>
          <a href="<?php echo SITE_ROOT; ?>/projects/<?php echo $project['id']; ?>/publish" class="btn btn-primary pull-right" type="button" style="margin-right: 4px; " target="_blank">Publish</a>
          <h4 class="media-heading"><?php echo $project['name']; ?> </h4>
          <p><?php echo $project['width']; ?>px X <?php echo $project['height']; ?>px, <?php echo $project['pages']; ?> pages</p>
        </div>
      </li>
      <?php endforeach ?>
    </ul>
  </div>
