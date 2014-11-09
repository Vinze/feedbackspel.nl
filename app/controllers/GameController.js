var GameController = {

	getHost: function(req, res) {
		res.render('game/host');
	},

	getClient: function(req, res) {
		res.render('game/client');
	}

};

module.exports = GameController;