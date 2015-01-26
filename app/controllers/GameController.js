var qr = require('qr-image');

var GameController = {

	getCreate: function(req, res) {
		var randomNumber = Math.floor(Math.random() * 9000) + 1000;
		res.redirect('host/' + randomNumber);
	},

	getHost: function(req, res) {
		res.render('game-host');
	},

	getPlay: function(req, res) {
		res.render('game-player');
	},

	getQRCode: function(req, res) {
		var size = parseInt(req.query.size) || 5;
		var options = { type: 'png', size: size, margin: 2 };
		var image = qr.image('http://' + req.headers.host + '/play/' + req.params.room, options);
		res.writeHead(200, { 'Content-Type': 'image/png' });
		image.pipe(res);
	}
	
};

module.exports = GameController;