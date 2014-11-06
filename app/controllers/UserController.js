var bcrypt    = require('bcrypt-nodejs');
var jwt       = require('jwt-simple');
var moment    = require('moment');
var validate  = require('../libs/validator');
var config    = require('../libs/config');
var User      = require('../models/User');
var Session   = require('../models/Session');

var UserController = {

	getDashboard: function(req, res) {
		res.render('dashboard', { message: req.flash('message') });
	},

	getLogin: function(req, res) {
		res.render('login', {
			email: req.flash('email') || '',
			message: req.flash('message')
		});
	},

	postLogin: function(req, res) {
		var input = req.body;

		User.findOne({ email: input.email }, function(err, user) {
			if ( ! user) return res.redirect('/login');

			bcrypt.compare(input.password, user.password, function(err, match) {
				if ( ! match) return res.redirect('/login');

				var expires = moment().add(1, 'years');
				var token = jwt.encode({
					user_id: user._id,
					email: user.email,
					firstname: user.firstname,
					lastname: user.lastname
				}, config.jwt_secret);
				
				Session.insert({
					user_id: user._id,
					token: token,
					expires: expires.unix(),
					ipaddress: req.connection.remoteAddress
				}, function(err, doc) {
					if (err) console.log(err);
				});

				res.cookie('jwtoken', token, { maxAge: expires.diff(moment()) });
				res.redirect('/');
			});

		});
	},

	getLogout: function(req, res) {
		res.clearCookie('jwtoken');
		res.redirect('/');
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
		var rules = {
			email: { required: true, email: true, minlength: 4, maxlength: 60 },
			firstname: { required: true },
			lastname: { required: true },
			password: { required: true, minlength: 3 },
			gender: { in: ['m', 'f'] }
		};
		validate(input, rules, function(errors) {
			if (errors) return res.send('Validation failed');

			User.findOne({ email: input.email }, function(err, exists) {
				if (exists) return res.send('E-mail already taken');

				User.insert({
					email: input.email,
					password: bcrypt.hashSync(input.password),
					firstname: input.firstname,
					lastname: input.lastname,
					created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
					updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
				}, function(err, doc) {
					res.redirect('/login');
				});
			});
		});
	},

	postCheckEmail: function(req, res) {
		User.findOne({ email: req.body.email }, function(err, exists) {
			res.json({ exists: exists ? true : false });
		});
	}
};

module.exports = UserController;

/*
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
*/