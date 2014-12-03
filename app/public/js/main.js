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

function enterFullscreen() {
	if (document.documentElement.requestFullscreen) {
		document.documentElement.requestFullscreen();
	} else if (document.documentElement.mozRequestFullScreen) {
		document.documentElement.mozRequestFullScreen();
	} else if (document.documentElement.webkitRequestFullscreen) {
		document.documentElement.webkitRequestFullscreen();
	} else if (document.documentElement.msRequestFullscreen) {
		document.documentElement.msRequestFullscreen();
	}
}

function exitFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	}
}