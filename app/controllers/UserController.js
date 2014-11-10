var bcrypt   = require('bcrypt-nodejs');
var jwt      = require('jwt-simple');
var moment   = require('moment');
var validate = require('../libs/validator');
var config   = require('../libs/config');
var db       = require('../libs/datastore');

var UserController = {

	getDashboard: function(req, res) {
		res.render('users/dashboard', { message: req.flash('message') });
	},

	getIndex: function(req, res) {
		res.render('users/index');
	},

	getProfile: function(req, res) {
		res.render('users/profile');
	},

	getLogin: function(req, res) {
		res.render('login', {
			email: req.flash('email')
		});
	},

	postLogin: function(req, res) {
		var input = req.body;

		db.users.findOne({ email: input.email }, function(err, user) {
			if ( ! user) {
				req.flash('message', { type: 'error', text: 'Het opgegeven e-mail adres werd niet gevonden..' });
				req.flash('email', input.email);
				return res.redirect('/login');
			}

			bcrypt.compare(input.password, user.password, function(err, match) {
				if ( ! match) {
					req.flash('message', { type: 'error', text: 'Het opgegeven wachtwoord is onjuist.' });
					req.flash('email', input.email);
					return res.redirect('/login');
				}

				var expires = moment().add(1, 'years');
				var token = jwt.encode({ user_id: user._id }, config.jwt_secret);

				db.sessions.insert({
					user_id: user._id,
					token: token,
					expires: expires.unix(),
					ipaddress: req.connection.remoteAddress
				}, function(err, doc) {
					if (err) console.log('error inserting token', err);
				});

				res.cookie('fbs_token', token, { maxAge: expires.diff(moment()) });
				res.redirect('/dashboard');
			});

		});
	},

	getLogout: function(req, res) {
		db.sessions.remove({ token: req.token }, function(err, removed) {
			if (err) console.log(err);
		});
		res.clearCookie('fbs_token');
		res.redirect('/');
	},

	getRegister: function(req, res) {
		res.render('users/register');
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

			db.users.findOne({ email: input.email }, function(err, exists) {
				if (exists) return res.send('E-mail already taken');

				db.users.insert({
					email: input.email,
					password: bcrypt.hashSync(input.password),
					firstname: input.firstname,
					lastname: input.lastname,
					admin: false,
					created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
					updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
				}, function(err, doc) {
					res.redirect('/login');
				});
			});
		});
	},

	checkEmail: function(req, res) {
		db.users.findOne({ email: req.body.email }, function(err, exists) {
			res.json({ exists: exists ? true : false });
		});
	},

	findAll: function(req, res) {
		db.users.find({}, { password: 0 }, function(err, users) {
			res.json(users);
		});
	},

	findOne: function(req, res) {
	},

	save: function(req, res) {
		var input = {
			email: req.body.email,
			firstname: req.body.firstname,
			lastname: req.body.lastname
		}

		if (req.body.password) {
			input.password = bcrypt.hashSync(req.body.password);
		}

		if (req.body._id) {
			db.users.update({ _id: req.body._id }, { $set: input }, {}, done);
		}

		function done(err) {
			if (err) console.log(err);
			db.users.find({}, { password: 0 }, function(err, users) {
				res.json(users);
			});
		}
	}
};

module.exports = UserController;