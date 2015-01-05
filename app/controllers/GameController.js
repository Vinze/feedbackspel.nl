var GameController = {

	getCreate: function(req, res) {
		var randomNumber = Math.floor(Math.random() * 9000) + 1000;
		res.redirect('host/' + randomNumber);
	},

	getHost: function(req, res) {
		res.render('game/host');
	},

	getPlay: function(req, res) {
		res.render('game/player');
	}
	
};

module.exports = GameController;