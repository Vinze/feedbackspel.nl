$(function() {
	var $toggle = $('.nav-toggle');
	var $nav = $('.nav');

	$toggle.on('click', function() {
		// $nav.transition({ 'margin-right': '100px' });
		$nav.slideToggle(200);
	});

	$(window).on('resize', function() {
		var w = $(window).width(); 
		if (w > 720 && $nav.is(':hidden')) {
			$nav.removeAttr('style');
		}
	});
});