var Datastore = require('nedb')
var bcrypt    = require('bcrypt-nodejs');
var md5       = require('MD5');
var validate  = require('../helpers/validate');
var db        = {};

db.users = new Datastore({ filename: './storage/users.db', autoload: true });

var UserController = {

	getLogin: function(req, res) {
		res.render('login');
	},

	postLogin: function(req, res) {
		// Find the user
		db.users.findOne({ email: req.body.email }, function(err, user) {
			// Check if the password matches
			bcrypt.compare(req.body.password, user.password, function(err, match) {
				if (match == true) {
					// Create the session token
					var timestamp = new Date().getTime()
					var data = {
						token: md5(user.email + timestamp),
						token_issued: timestamp
					};
					db.users.update({ _id: user._id }, { $set: data }, function(err) {
						if (err) console.log(err);
					});

					res.redirect('/dashboard');
				} else {
					res.redirect('/login');
				}
			});
		});

		// res.json(req.body);
		// var hash = bcrypt.hashSync(req.body.password);
		// console.log(hash);
	},

	getRegister: function(req, res) {
		res.render('register');
	},

	postRegister: function(req, res) {
		var rules = {
			email: 'required|email',
			firstname: 'required',
			lastname: 'required',
			password: 'required|min:2',
			password_repeat: 'required|same:password',
			gender: 'in:m,f'
		}

		var errors = validate(req.body, rules);
		
		if (errors.length > 0) {
			console.log(errors);
			res.redirect('/register');
		} else {
			db.users.insert({
				email: req.body.email,
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				password: bcrypt.hashSync(req.body.password),
				gender: req.body.gender,
				token: '',
				token_issued: 0
			}, function(err, doc) {
				if (err) console.log(err);
			});
			res.redirect('/login');
		}
	},

	getDashboard: function(req, res) {
		res.render('dashboard');
	}

};

module.exports = UserController;