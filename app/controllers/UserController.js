var bcrypt    = require('bcrypt-nodejs');
var jwt       = require('jwt-simple');
var moment    = require('moment');
var _         = require('underscore');
var User      = require('../models/User')
var config    = require('../libs/config');
var validate  = require('../libs/ez-validator');

var rules = {
	email: { required: true, email: true, minlength: 4, maxlength: 60 },
	firstname: { required: true },
	lastname: { required: true },
	password: { required: true, minlength: 3 },
	password_repeat: { required: true, same: 'password' },
	gender: { in: ['m', 'f'] }
};

var UserController = {

	getLogin: function(req, res) {
		res.render('login', {
			email: req.flash('email') || '',
			message: req.flash('message')
		});
	},

	postLogin: function(req, res) {
		if (req.body.email.length < 3) {
			req.flash('message', {type: 'error', message: 'Voer een e-mail adres in!'});
			return res.redirect('/login');
		} 
		// Find the user
		User.findByEmail(req.body.email, function(err, user) {
			// Check if the password matches
			if ( ! user) {
				req.flash('message', {type: 'error', message: 'Het ingevoerde e-mail adres is niet bekend.'});
				return res.redirect('/login');
			}

			bcrypt.compare(req.body.password, user.password, function(err, match) {
				if (match == true) {
					// Create the JWToken
					var expires = moment().add(config.token_expires, 'days').unix();
					var token = jwt.encode({
						expires: expires,
						user_id: user._id,
						email: user.email,
						firstname: user.firstname,
						lastname: user.lastname
					}, config.jwt_secret);
					res.cookie('jwtoken', token, { maxAge: 31536000 * 1000 });
					res.redirect('/dashboard');
				} else {
					req.flash('email', req.body.email);
					req.flash('message', {type: 'error', message: 'E-mail adres/wachtwoord komen niet overeen.'});
					res.redirect('/login');
				}
			});
		});
	},

	getRegister: function(req, res) {
		var defaults = { email: '', firstname: '', lastname: '', gender: 'm' };
		res.render('register', {
			input: req.flash('old_input') || defaults,
			message: req.flash('message')
		});
	},

	postRegister: function(req, res) {
		var input = req.body;

		validate(input, rules, function(errors) {
			if (errors) {
				req.flash('message', { type: 'error', message: 'Niet alle verplichte velden zijn (correct) ingevuld.' });
				req.flash('old_input', {
					email: input.email,
					firstname: input.firstname,
					lastname: input.lastname,
					gender: input.gender
				});
				return res.redirect('/register');
			}

			User.findByEmail(input.email, function(err, user) {
				if (user) {
					req.flash('message', {type: 'error', message: 'Het ingevoerde e-mail adres is al in gebruik. (<a href="/forgot-password">Wachtwoord vergeten?</a>)'});
					req.flash('old_input', {
						email: input.email,
						firstname: input.firstname,
						lastname: input.lastname,
						gender: input.gender
					});
					return res.redirect('/register');
				}

				User.insert({
					email: input.email,
					firstname: input.firstname,
					lastname: input.lastname,
					password: bcrypt.hashSync(input.password),
					gender: input.gender,
					registered: moment().format('YYYY-MM-DD HH:mm:ss')
				}, function(err, doc) {
					if (err) console.log(err);
				});
				req.flash('email', input.email);
				req.flash('message', { type: 'success', message: 'Je kunt nu inloggen!' });
				return res.redirect('/login');
			});
			
		});
	},

	save: function(req, res) {
		console.log(req.body);
		res.json(req.body);

	},

	getDashboard: function(req, res) {
		res.render('dashboard', { message: req.flash('message') });
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