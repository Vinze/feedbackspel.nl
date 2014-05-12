var validate = require('../modules/validate');
var Datastore = require('nedb');
var db = new Datastore({
	filename: './storage/users.db',
	autoload: true
});
// var database = require('../modules/database');

var UserController = {

	getIndex: function(req, res) {
		db.find({}).sort({'email': 1}).exec(function(err, docs) {
			res.render('users/index', {
				users: docs
			});
		});
	},

	getRegister: function(req, res) {
		var errors = req.flash('errors');

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
		var user = {
			email: req.body.email,
			password: req.body.password,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			gender: req.body.gender
		}
		validate(req.body, rules, function(validates, errors) {
			if (validates) {
				db.insert(user, function(err, doc) {
					res.redirect('/users');
				});
			} else {
				req.flash('errors', errors);
				req.flash('user', user);
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