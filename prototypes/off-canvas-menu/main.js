$('#toggle-nav').on('click', function(evt) {
	$('body').toggleClass('show-nav');
	evt.preventDefault();
});

$("#close-nav").on('click', function(evt) {
	$('body').toggleClass('show-nav');
	evt.preventDefault();
});

$(document).on('keyup', function(evt) {
	if (evt.keyCode == 27) {
		$('body').toggleClass('show-nav');
	}
});