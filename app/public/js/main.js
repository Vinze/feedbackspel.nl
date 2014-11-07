function showSidebar() {
	$('body').addClass('show-nav');
	$('body').prepend('<div class="site-overlay close-nav"></div>');
}

function hideSidebar() {
	$('body').removeClass('show-nav');
	$('.site-overlay').remove();
}

$('.nav-toggle').on('tap, click', function(evt) {
	showSidebar();
	evt.preventDefault();
});

$('.sidebar').on('swipeRight', function() {
	hideSidebar();
});

$('body').on('tap, click', '.close-nav', function(evt) {
	hideSidebar();
	evt.preventDefault();
});

$(document).on('keyup', function(evt) {
	if (evt.keyCode == 27) {
		hideSidebar();
	}
});