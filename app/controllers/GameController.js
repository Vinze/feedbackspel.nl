var GameController = {

	getHost: function(req, res) {
		res.render('host');
	},

	getPlay: function(req, res) {
		res.render('player');
	}
	
};

module.exports = GameController;