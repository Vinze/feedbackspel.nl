var GameController = {

	getHost: function(req, res) {
		res.render('game-host');
	},

	getPlay: function(req, res) {
		res.render('game-player');
	}

};

module.exports = GameController;