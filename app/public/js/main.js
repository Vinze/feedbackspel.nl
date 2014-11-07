function showSidebar() {
	$('body').addClass('show-nav');
	$('body').prepend('<div class="sidebar-overlay close-nav"></div>');
}

function hideSidebar() {
	$('body').removeClass('show-nav');
	$('.sidebar-overlay').remove();
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