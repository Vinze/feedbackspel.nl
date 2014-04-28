(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-49342046-1', 'feedbackspel.nl');
ga('send', 'pageview');

$(function() {
	var $toggle = $('.nav-toggle');
	var $nav = $('.nav');

	$toggle.on('click', function() {
		$nav.slideToggle(200);
	});

	$(window).on('resize', function() {
		var w = $(window).width(); 
		if (w > 720 && $nav.is(':hidden')) {
			console.log('remove style');
			$nav.removeAttr('style');
		}
	});
});