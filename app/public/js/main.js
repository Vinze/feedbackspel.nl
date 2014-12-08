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

$('.sidebar ul a').on('tap, click', function(evt) {
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

var user = null;

$.getJSON('/user', function(data) {
	user = data;
});

var views = {
	cached: {},
	html: function(page, callback) {
		if (views.cached[page]) {
			callback(views.cached[page]);
		} else {
			$.get('/spa/views/' + page, function(html, status, xhr) {
				views.cached[page] = html;
				callback(html);
			});
		}
	},
	render: function(page, callback) {
		views.html(page, function(html) {
			$('body').scrollTop(0);
			$('#content').html(html);
			if (callback) callback();
		});
	}
};

page.base('/spa');

page('/', function() {
	views.render('home', function() {
		$('body').attr('class', 'home');
	});
});

page('/login', function() {
	views.html('login', function(html) {
		var FormController = new Ractive({
			el: 'content',
			template: html,
			data: {
				error: null,
				input: { email: '', password: '' }
			}
		});
		FormController.on({
			submit: function(evt) {
				var input = FormController.get('input');
				$.post('/api/login', input, function(res) {
					FormController.set('error', res.error);
					if ( ! res.error) {
						Cookies.set('fbs_token', res.token);
						page.redirect('/dashboard');
					}
				});
				evt.original.preventDefault();
			}
		});
	});
});

page('/dashboard', function() {
	views.render('dashboard', function() {
		$('body').removeClass('home');

		$('#upload-link').on('click', function(evt) {
			$('#upload-select').click();
			evt.preventDefault();
		});
		$('#upload-select').on('change', function() {
			var image = $('#upload-select').val();
			$('#upload-form').submit();
			console.log(image);
		});
	});
});

page('/logout', function() {
	console.log('logout');
	Cookies.expire('fbs_token');
	page.redirect('/');
});

page('*', function() {
	$('#content').html('<h1>404</h1>');
});

page();