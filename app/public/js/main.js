function showNavigation() {
	$('body').addClass('show-nav');
	$('body').prepend('<div class="site-overlay" id="close-nav"></div>');
}

function hideNavigation() {
	$('body').removeClass('show-nav');
	$('#close-nav').remove();
}

$('#open-nav').on('click', function(evt) {
	showNavigation();
	evt.preventDefault();
});

$('body').on('click', '#close-nav', function(evt) {
	hideNavigation();
	evt.preventDefault();
});

$(document).on('keyup', function(evt) {
	if (evt.keyCode == 27) {
		hideNavigation();
	}
});