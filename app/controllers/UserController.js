var User = require('../models/User');

var UserController = {

	getRegister: function(req, res) {
		res.render('users/register');
	},

	postRegister: function(req, res) {
		User.insert(req.body, function(err, user) {
			console.log('err:', err);
			console.log('user:', user);
		});
	},

	getLogin: function(req, res) {
		res.render('users/login');
	},

	postLogin: function(req, res) {
		res.send(req.body);
	}
}

module.exports = UserController;