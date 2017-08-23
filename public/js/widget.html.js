(function($) {
    $.fn.extend({
		paperHTML: function(options) {

			this.html( this.attr('data-content') ) ; 

			return this ;

		}
    });
})(jQuery);



