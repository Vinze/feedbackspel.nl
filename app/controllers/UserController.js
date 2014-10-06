var Datastore = require('nedb')
var bcrypt    = require('bcrypt-nodejs');
var validate  = require('../helpers/validate');
var jwt       = require('jwt-simple');
var config    = require('../config');
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
					// Create the JWToken
					var payload = { iat: new Date().getTime(), user_id: user._id, user_mail: user.email };
					var token = jwt.encode(payload, config.jwt_secret);
					res.cookie('token', token, { maxAge: 31536000 * 1000 });
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
			db.users.insert({
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
		res.render('dashboard');
	},

	getLogout: function(req, res) {
		res.clearCookie('token');
		res.redirect('/');
	},

	findAll: function(req, res) {
		db.users.find({}, function(err, users) {
			res.json(users);
		});
	},

	findOne: function(req, res) {
		var user_id = req.params.id;
		db.users.findOne({_id: user_id}, function(err, user) {
			res.json(user);
		});
	},

	delete: function(req, res) {
		var user_id = req.params.id;
		db.users.remove({ _id: user_id }, function(err, doc) {
			res.json(doc);
		});
	},

	checkEmail: function(req, res) {
		db.users.findOne({ email: req.body.email }, function(err, doc) {
			res.json((doc) ? true : false);
		});
	}

};

module.exports = UserController;