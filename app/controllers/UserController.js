var bcrypt   = require('bcrypt-nodejs');
var moment   = require('moment');
var fs       = require('fs');
var spawn    = require('child_process').spawn;
var auth     = require('../libs/auth');
var validate = require('../libs/validator');
var db       = require('../libs/datastore');

function inArray(needle, haystack) {
	return haystack.indexOf(needle) != -1;
}

var UserController = {

	getStart: function(req, res) {
		if (req.user) {
			if (req.user.image) {
				res.render('users/dashboard');
			} else {
				res.render('users/select-avatar');
			}
		} else {
			res.render('users/start');
		}
	},

	getAvatar: function(req, res) {
		var imagepath = __dirname + '/../storage/avatars/' + req.params.image;
		fs.exists(imagepath, function(exists) {
			if ( ! exists) {
				imagepath = __dirname + '/../public/img/placeholder.png';
			}
			fs.readFile(imagepath, function(err, data) {
				res.writeHead(200, {'Content-Type': 'image/png' });
				res.end(data, 'binary');
			});
		});
	},

	postAvatar: function(req, res) {
		var mimetypes = ['image/jpeg', 'image/png'];

		if (req.files && req.files.image) {
			if ( ! inArray(req.files.image.mimetype, mimetypes)) {
				fs.unlink(req.files.image.path);
				return res.redirect('/start');
			}
			var input = __dirname + '/../' + req.files.image.path;
			var output = __dirname + '/../storage/avatars/' + req.user._id + '.png';
			var convert = spawn('convert', [input, '-resize', '150x150^', '-gravity', 'center', '-crop', '150x150+0+0', '+repage', '-auto-orient', output]);

			convert.on('close', function (code) {
				res.redirect('/start');
				fs.unlink(input);
			});

			db.users.update({ _id: req.user._id }, { $set: { image: true } }, function(err) {
				if (err) console.log(err);
			});
		} else {
			res.redirect('/start');
		}
	},

	getLogin: function(req, res) {
		res.render('users/login');
	},

	postLogin: function(req, res) {
		var input = req.body;
		db.users.findOne({ email: input.email }, function(err, user) {
			if ( ! user) {
				return res.json({ error: 'Het opgegeven e-mail adres werd niet gevonden.' });
			}
			bcrypt.compare(input.password, user.password, function(err, match) {
				if ( ! match) {
					return res.json({ error: 'Het opgegeven wachtwoord is onjuist.' });
				}
				var token = auth.setToken(user, req);

				res.json({ error: null, token: token });
			});
		});
	},

	getLogout: function(req, res) {
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
					email: input.email.toLowerCase(),
					password: bcrypt.hashSync(input.password),
					firstname: input.firstname,
					lastname: input.lastname,
					gender: input.gender,
					avatar: false,
					admin: false,
					created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
					updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
				}, function(err, user) {
					req.flash('email', user.email);
					req.flash('message', { type: 'success', text: 'Je kunt nu inloggen.' });
					res.redirect('/login?email=' + input.email);
				});
			});
		});
	},

	getEmail: function(req, res) {
		db.users.findOne({ email: req.body.email }, function(err, exists) {
			res.json({ exists: exists ? true : false });
		});
	},

	getUsers: function(req, res) {
		db.users.findAll(function(err, users) {
			res.json(users);
		});
	},

	postSave: function(req, res) {
		var input = {
			email: req.body.email.toLowerCase(),
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			gender: req.body.gender
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
	},

	postDelete: function(req, res) {
		var imagepath = './storage/avatars/' + req.body._id + '.png';
		fs.exists(imagepath, function(exists) {
			if (exists) fs.unlink(imagepath);
		});

		db.users.remove({ _id: req.body._id }, function() {
			db.users.find({}, { password: 0 }, function(err, users) {
				res.json(users);
			});
		});
	}
	
};

module.exports = UserController;