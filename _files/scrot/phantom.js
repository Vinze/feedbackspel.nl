var page = require('webpage').create();
var system = require('system');

var resolution = system.args[1];
var url = system.args[2];
var filename = system.args[3];
var timeout = system.args[4];

if (url.substr(0, 4) != 'http') {
	url = 'http://' + url;
}

var width = resolution.split('x')[0];
var height = resolution.split('x')[1];

page.viewportSize = {
	width: width,
	height: height
};
page.clipRect = {
	top: 0,
	left: 0,
	width: width,
	height: height
};

page.open(url, function() {
	page.evaluate(function() {
		document.body.bgColor = 'white';
	});

	setTimeout(function () {
		page.render('screenshots/' + filename);
		phantom.exit();
	}, timeout);
});