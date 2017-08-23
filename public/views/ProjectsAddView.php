<?php $this->layout('TemplateBack') ?>

<!-- Panel -->
<div class="panel panel-primary">
  <div class="panel-heading">
    <h3 class="panel-title">Add project</h3>
  </div>
  <div class="panel-body">

    <!-- Form -->
    <form action="<?php echo SITE_ROOT; ?>/projects/add-action/" method="POST">
      <div class="form-group">
        <label>Name</label>
        <input type="text" name="name" class="form-control" value="New presentation">
      </div>
      <div class="form-group">
        <label>Width (px)</label>
        <input type="text" name="width" class="form-control" value="500">
      </div>
      <div class="form-group">
        <label>Height (px)</label>
        <input type="text" name="height" class="form-control" value="500">
      </div>
      <button type="submit" class="btn btn-primary">Add</button>
    </form>

  </div>
</div>
