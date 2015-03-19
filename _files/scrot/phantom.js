var page = require('webpage').create();
var system = require('system');

var type = system.args[1];
var url = system.args[2];
var filename = system.args[3];
var timeout = system.args[4];

if (url.substr(0, 4) != 'http') {
	url = 'http://' + url;
}

if (type == 'mobile') {
	page.viewportSize = {
		width: 320,
		height: 568
	};
	page.clipRect = {
		top: 0,
		left: 0,
		width: 320,
		height: 568
	};
}

if (type == 'desktop') {
	page.viewportSize = {
		width: 1280,
		height: 720
	};
	page.clipRect = {
		top: 0,
		left: 0,
		width: 1280,
		height: 720
	};
}

page.open(url, function() {
	page.evaluate(function() {
		document.body.bgColor = 'white';
	});

	setTimeout(function () {
		page.render(filename);
		phantom.exit();
	}, timeout);
});