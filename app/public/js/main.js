baseURL = 'http://' + window.location.host;

$('a').on('tap, click', function(evt) {
	if (this.href.length > 2) {
		document.location.href = this.href;
		evt.preventDefault();
	}
});

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

function getQueryParam(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


$(document).on('ajaxBeforeSend', function(e, xhr, options) {
	var token = Cookies.get('fbs_token') || getQueryParam('token');

	if (token) {
		xhr.setRequestHeader('X-Auth-Token', token);
	}
});