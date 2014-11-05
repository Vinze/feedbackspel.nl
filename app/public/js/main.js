function showNavigation() {
	$('body').addClass('show-nav');
	$('body').prepend('<div class="site-overlay close-nav"></div>');
}

function hideNavigation() {
	$('body').removeClass('show-nav');
	$('.site-overlay').remove();
}

$('.nav-toggle').on('tap, click', function(evt) {
	showNavigation();
	evt.preventDefault();
});

$('.navigation').on('swipeRight', function() {
	hideNavigation();
});

$('body').on('tap, click', '.close-nav', function(evt) {
	hideNavigation();
	evt.preventDefault();
});

$(document).on('keyup', function(evt) {
	if (evt.keyCode == 27) {
		hideNavigation();
	}
});