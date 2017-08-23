$(document).ready(function() {

  // Initialize Summernote
  $('#summernote').summernote({
    height: 300,                 // set editor height
    minHeight: null,             // set minimum height of editor
    maxHeight: null,             // set maximum height of editor
    focus: true,                 // set focus to editable area after initializing summernote
  });

  // Populate the normal hidden HTML textarea with the Summernote HTML
  // before we submit the form
  $('#update-detail-button').on('click', function(e) {
    e.preventDefault();
    $('#update-detail-content').val($('#summernote').code());
    // We set the timeout here to compensate for any lag
    setTimeout(function() {
      document.forms["update-detail-form"].submit();
    },500);
  });

});
