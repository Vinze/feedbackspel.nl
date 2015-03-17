var currentUser, viewCache = {};

var Sidebar = new function() {
	var self = this;

	self.show = function() {
		$('body').addClass('sidebar-open');
		$('body').prepend('<div class="sidebar-overlay close-sidebar"></div>');
	}
	
	self.hide = function() {
		$('body').removeClass('sidebar-open');
		$('.sidebar-overlay').remove();
	}

	self.init = function() {
		$('.sidebar-toggle').on('tap, click', function(evt) {
			self.show();
			evt.preventDefault();
		});

		$('.sidebar-toggle').on('swipeLeft', function() {
			self.show();
		});

		$('.sidebar').on('swipeRight', function() {
			self.hide();
		});

		$('body').on('tap, click', '.close-sidebar', function(evt) {
			self.hide();
			evt.preventDefault();
		});

		$(document).on('keyup', function(evt) {
			if (evt.keyCode == 27) {
				self.hide();
			}
		});
	}
}

$('.nav').on('click', 'a', function(evt) {
	var href = $(this).attr('href');
	page(href);
	setTimeout(function() {
		Sidebar.hide();
	}, 200);
	evt.preventDefault();
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

var helpers = Ractive.defaults.data;

helpers.moment = function(timeString) {
	return moment(timeString);
}

helpers.nl2br = function(text) {
	return text.replace(/\n/g, '<br>');
}

function loadView(view, callback) {
	if (viewCache[view])
		return callback(viewCache[view]);
	
	$.get('/views/' + view, function(html) {
		viewCache[view] = html;
		callback(html);
	});
}

function renderMenu(user) {
	loadView('menu.html', function(html) {
		var menu = Mustache.render(html, { loggedIn: user ? true : false });
		$('.nav').html(menu);
	});
}

function resizeHandler(evt) {
	var height = $(window).height() - 64;
	$('#banner').css({ 'min-height': height });
}

if (document.URL.indexOf('feedbackspel') != -1) {
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-56545112-1', 'auto');
	ga('send', 'pageview');
}

Sidebar.init();

renderMenu();