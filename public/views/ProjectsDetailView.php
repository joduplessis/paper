<?php $this->layout('TemplateBack') ?>

<!-- Panel -->
<div class="panel panel-primary">
  <div class="panel-heading">
    <h3 class="panel-title">Edit project</h3>
  </div>
  <div class="panel-body">

    <!-- Form -->
    <form action="<?php echo SITE_ROOT; ?>/projects/<?=$this->e($project['id'])?>/update/" method="POST">
      <div class="form-group">
        <label>Name</label>
        <input type="text" name="name" class="form-control" value="<?=$this->e($project['name'])?>">
      </div>
      <div class="form-group">
        <label>Width (px)</label>
        <input type="text" name="width" class="form-control" value="<?=$this->e($project['width'])?>">
      </div>
      <div class="form-group">
        <label>Height (px)</label>
        <input type="text" name="height" class="form-control" value="<?=$this->e($project['height'])?>">
      </div>
      <button type="submit" class="btn btn-primary">Update</button>
    </form>

    <!-- Add an image -->
    <h2>Upload an image</h2>
    <form action="<?php echo SITE_ROOT; ?>/projects/<?=$this->e($project['id'])?>/image-add/" method="POST" enctype="multipart/form-data">
      <div class="form-group">
        <input type="file" name="image" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Add</button>
    </form>

    <!-- Remove an image -->
    <h2>Remove images</h2>
    <form action="<?php echo SITE_ROOT; ?>/projects/<?=$this->e($project['id'])?>/image-delete/" method="POST">
      <div class="form-group">
        <div class="row">
          <div class="col-xs-6 col-md-3">
          <?php
            if ( $this->e($project['images']) != "" ) {
              $images = explode(",", $this->e($project['images']));
              foreach($images as $image):
                ?>
                  <input type="checkbox" name="images[]" value="<?php echo $image; ?>"/>
                  <img src="<?php echo SITE_ROOT; ?>/assets/<?php echo $image; ?>" height="100"/>
                <?php
              endforeach;
            }
          ?>
          </div>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Delete</button>
    </form>
  </div>
</div>
