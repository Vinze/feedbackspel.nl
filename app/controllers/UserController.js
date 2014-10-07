var User      = require('../models/User')
var bcrypt    = require('bcrypt-nodejs');
var validate  = require('../libs/validate');
var jwt       = require('jwt-simple');
var moment    = require('moment');
var config    = require('../config');

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
						firstname: user.firstname
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
		var errors = validate(req.body, {
			email: 'required|email',
			firstname: 'required',
			lastname: 'required',
			password: 'required|min:2',
			password_repeat: 'required|same:password',
			gender: 'in:m,f'
		});

		if (errors.length > 0) {
			req.flash('message', {type: 'error', message: 'Niet alle verplichte velden zijn (correct) ingevuld.'});
			req.flash('old_input', {
				email: req.body.email,
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				gender: req.body.gender
			});
			res.redirect('/register');
		} else {
			User.findByEmail(req.body.email, function(err, user) {
				if (user) {
					req.flash('message', {type: 'error', message: 'Het ingevoerde e-mail adres is al in gebruik. (<a href="/forgot-password">Wachtwoord vergeten?</a>)'});
					req.flash('old_input', {
						email: req.body.email,
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						gender: req.body.gender
					});
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
					req.flash('email', req.body.email);
					req.flash('message', {type: 'success', message: 'Je kunt nu inloggen!'});
					res.redirect('/login');
				}
			});
		}
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