var GameController = {

	getHost: function(req, res) {
		res.render('game-host');
	},

	getPlay: function(req, res) {
		res.render('game-player');
	},

	getTest: function(req, res) {
		res.json(Game.getState());
	}

};

module.exports = GameController;