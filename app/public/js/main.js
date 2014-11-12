function showSidebar() {
	$('body').addClass('sidebar-open');
	$('body').prepend('<div class="sidebar-overlay close-sidebar"></div>');
}

function hideSidebar() {
	$('body').removeClass('sidebar-open');
	$('.sidebar-overlay').remove();
}

$('.sidebar-toggle').on('tap, click', function(evt) {
	showSidebar();
	evt.preventDefault();
});

$('.sidebar').on('swipeRight', function() {
	hideSidebar();
});

$('body').on('tap, click', '.close-sidebar', function(evt) {
	hideSidebar();
	evt.preventDefault();
});

$(document).on('keyup', function(evt) {
	if (evt.keyCode == 27) {
		hideSidebar();
	}
});