// var qr = require('qr-image');
var _  = require('underscore');

var GameController = {

	getCreate: function(req, res) {
		var randomNumber = _.random(1000, 9000);
		res.redirect('host/' + randomNumber);
	},

	getHost: function(req, res) {
		var room = req.params.room;
		res.render('game-host', { pageTitle: 'Feedbackspel - ' + room });
	},

	getPlay: function(req, res) {
		var room = req.params.room;
		res.render('game-player', { pageTitle: 'Feedbackspel - ' + room });
	},

	roomParser: function(req, res, next) {
		var room = parseInt(req.path.substr(1,4).replace(/[^0-9.]/g, '') || 0);

		if (room >= 1000 && room <= 9999) {
			return res.redirect('/play/' + room);
		}

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