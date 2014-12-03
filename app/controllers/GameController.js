var GameController = {

	getHost: function(req, res) {
		res.render('host');
	},

	getPlay: function(req, res) {
		res.render('player');
	},

	getTest: function(req, res) {
		res.json(Game.getState());
	}

};

module.exports = GameController;