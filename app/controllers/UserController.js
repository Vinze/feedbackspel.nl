var User      = require('../models/User')
var bcrypt    = require('bcrypt-nodejs');
var validate  = require('../libs/validate');
var jwt       = require('jwt-simple');
var moment    = require('moment');
var config    = require('../config');

var UserController = {

	getLogin: function(req, res) {
		res.render('login');
	},

	postLogin: function(req, res) {
		// Find the user
		User.findByEmail(req.body.email, function(err, user) {
			// Check if the password matches
			if ( ! user) return res.redirect('/login');

			bcrypt.compare(req.body.password, user.password, function(err, match) {
				if (match == true) {
					// Create the JWToken
					var expires = moment().add(config.token_expires, 'days').unix();
					var token = jwt.encode({
						expires: expires,
						user_id: user._id,
						email: user.email,
						firstname: user.firstname
					}, config.jwt_secret);
					res.cookie('jwtoken', token, { maxAge: 31536000 * 1000 });
					res.redirect('/dashboard');
				} else {
					res.redirect('/login');
				}
			});
		});
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
			User.insert({
				email: req.body.email,
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				password: bcrypt.hashSync(req.body.password),
				gender: req.body.gender
			}, function(err, doc) {
				if (err) console.log(err);
			});
			res.redirect('/login');
		}
	},

	getDashboard: function(req, res) {
		console.log(req.user);
		res.render('dashboard');
	},

	getLogout: function(req, res) {
		res.clearCookie('jwtoken');
		res.redirect('/');
	},

	findAll: function(req, res) {
		User.findAll(function(err, users) {
			res.json(users);
		});
	},

	findOne: function(req, res) {
		var user_id = req.params.id;
		User.findById(user_id, function(err, user) {
			res.json(user);
		});
	},

	delete: function(req, res) {
		var user_id = req.params.id;
		User.removeById(user_id, function(err, doc) {
			res.json(doc);
		});
	},

	checkEmail: function(req, res) {
		User.findByEmail(req.body.email, function(err, user) {
			res.json((user) ? true : false);
		});
	}

};

module.exports = UserController;