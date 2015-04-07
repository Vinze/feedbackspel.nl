// var qr = require('qr-image');
var _  = require('underscore');

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function inRange(num, start, end) {
	return parseInt(num) >= start && parseInt(num) <= end;
}

function getRoom(num) {
	if ( ! isNumber(num) || ! inRange(num, 1000, 9999)) {
		return null;
	}

	return parseInt(num);
}

var GameController = {

	getCreate: function(req, res) {
		var randomNumber = _.random(1000, 9000);
		res.redirect('host/' + randomNumber);
	},

	getHost: function(req, res) {
		var room = getRoom(req.path.substr(6));

		if ( ! room) return res.redirect('/dashboard');

		res.render('game-host', { pageTitle: 'Feedbackspel: ' + room });
	},

	getPlay: function(req, res) {
		var room = getRoom(req.path.substr(6));

		if ( ! room) return res.redirect('/dashboard');

		res.render('game-player', { pageTitle: 'Feedbackspel: ' + room });
	},

	roomParser: function(req, res, next) {
		var room = getRoom(req.path.substr(1));

		if (room) return res.redirect('/play/' + room);

		next();
	}

	// getQRCode: function(req, res) {
	// 	var size = parseInt(req.query.size) || 5;
	// 	var options = { type: 'png', size: size, margin: 2 };
	// 	var image = qr.image('http://' + req.headers.host + '/play/' + req.params.room, options);
	// 	res.writeHead(200, { 'Content-Type': 'image/png' });
	// 	image.pipe(res);
	// }
	
};

module.exports = GameController;