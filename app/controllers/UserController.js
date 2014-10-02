var UserController = {

	getLogin: function(req, res) {
		res.render('login');
	},

	postLogin: function(req, res) {
		res.json(req.body);
	},

	getRegister: function(req, res) {
		res.render('register');
	},

	postRegister: function(req, res) {
		res.json(req.body);
	},

	getDashboard: function(req, res) {
		res.render('dashboard');
	}

};

module.exports = UserController;