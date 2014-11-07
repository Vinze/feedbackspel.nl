var bcrypt   = require('bcrypt-nodejs');
var jwt      = require('jwt-simple');
var moment   = require('moment');
var validate = require('../libs/validator');
var config   = require('../libs/config');
var db       = require('../libs/datastore');

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

		db.users.findOne({ email: input.email }, function(err, user) {
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
				
				db.sessions.insert({
					user_id: user._id,
					token: token,
					expires: expires.unix(),
					ipaddress: req.connection.remoteAddress
				}, function(err, doc) {
					if (err) console.log(err);
				});

				res.cookie('jwtoken', token, { maxAge: expires.diff(moment()) });
				res.redirect('/dashboard');
			});

		});
	},

	getLogout: function(req, res) {
		db.sessions.remove({ token: req.token }, function(err, removed) {
			if (err) console.log(err);
		});
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
	}
};

module.exports = UserController;