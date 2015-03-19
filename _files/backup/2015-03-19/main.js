baseURL = 'http://' + window.location.host;

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

$('a').on('tap, click', function(evt) {
	if (this.href.length > 2) {
		document.location.href = this.href;
		evt.preventDefault();
	}
});

Sidebar.init();

(function(window) {
	var viewCache = {};

	function loadView(view, callback) {
		if (viewCache[view])
			return callback(viewCache[view]);
		
		$.get(baseURL + '/views/' + view, function(html) {
			viewCache[view] = html;
			callback(html);
		});
	}

	window.loadView = loadView;
	
} (window));

function replaceTags(content, tags) {
	return content.replace(/\[(.*?)\]/gi, function(match, text) {
		if (tags[text]) {
			return tags[text];
		} else {
			return match;
		}
	});
}

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

helpers.baseURL = baseURL;