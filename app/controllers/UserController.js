var DB = require('../models/DB');

var UserController = {

	getRegister: function(req, res) {
		res.render('users/register');
	},

	postRegister: function(req, res) {
		var user = {
			email: req.body.email,
			password: req.body.password,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			gender: req.body.gender
		}
		DB.insert('users', user, function(err, res) {
			console.log('err', err);
			console.log('res', res);
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