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

var cachedViews = {};
function loadView(page, callback) {
	$.get('/views/' + page, function(html) {
		cachedViews[page] = html;
		callback(html);
	});
}

page.base('/spa');

page('/', function() {
	loadView('home.html', function(html) {
		var Home = new Ractive({
			el: "content",
			template: html,
			data: { show: 'front' }
		});
		Home.on({
			showMore: function(evt) {
				Home.set('show', null).then(function() {
					Home.set('show', 'back');
				});
				evt.original.preventDefault();
			},
			back: function(evt) {
				Home.set('show', null).then(function() {
					Home.set('show', 'front');
				});
				evt.original.preventDefault();
			}
		});
	});
});

page('/start', function() {
	loadView('start.html', function(html) {
		var StartForm = new Ractive({
			el: 'content',
			template: html,
			data: { email: '', error: null, submitted: false }
		});
		StartForm.on('submit', function(evt) {
			var email = StartForm.get('email');
			$.post('/api/start', { email: email }, function(res) {
				console.log(res);
				StartForm.set('error', res.error);
				if ( ! res.error) {
					StartForm.set('submitted', true);
				}
			});
			evt.original.preventDefault();
		});
	});
});

page('/login', function() {
	
});

page('/logout', function() {
	user = null;
	Cookies.expire('fbs_token');
	page.redirect('/');
});

page('/dashboard', function() {
	if ( ! user) return page.redirect('/login');

	views.render('dashboard', function() {
		// $('#upload-link').on('click', function(evt) {
		// 	$('#upload-select').click();
		// 	evt.preventDefault();
		// });
		// $('#upload-select').on('change', function() {
		// 	var image = $('#upload-select').val();
		// 	$('#upload-form').submit();
		// 	console.log(image);
		// });
	});
});

page('/kernkwadranten', function() {
	views.render('kernkwadranten.html');
});

page('*', function() {
	$('#content').html('<h1>404</h1>');
});

page();

