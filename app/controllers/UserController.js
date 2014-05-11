var validate = require('../modules/validate');
var database = require('../modules/database');

var UserController = {

	getRegister: function(req, res) {
		var errors = req.flash('errors');
		console.log(req.flash('errors'));
		res.render('users/register', {
			errors: errors
		});
	},

	postRegister: function(req, res) {
		var rules = {
			'email': 'required|email',
			'password': 'required',
			'password2': 'required|same:password',
			'firstname': 'required',
			'lastname': 'required',
			'gender': 'in:m,f'
		}
		validate(req.body, rules, function(validates, errors) {
			// console.log('Validates:', validates);
			// console.log('Errors:', errors);
			if (validates) {
				var user = {
					email: req.body.email,
					password: req.body.password,
					firstname: req.body.firstname,
					lastname: req.body.lastname,
					gender: req.body.gender
				}
			} else {
				req.flash('errors', errors);
				res.redirect('/register');
			}
		});

		// database.insert('users', user, function(err, res) {
		// 	console.log('err', err);
		// 	console.log('res', res);
		// });
	},

	getLogin: function(req, res) {
		res.render('users/login');
	},

	postLogin: function(req, res) {
		res.send(req.body);
	}
}

module.exports = UserController;