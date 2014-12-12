var bcrypt   = require('bcrypt-nodejs');
var moment   = require('moment');
var fs       = require('fs');
var exec     = require('child_process').exec;
var auth     = require('../libs/auth');
var validate = require('../libs/validator');
var db       = require('../libs/datastore');

function inArray(needle, haystack) {
	return haystack.indexOf(needle) != -1;
}

var UserController = {

	getDashboard: function(req, res) {
		res.render('users/dashboard', { message: req.flash('message') });
	},

	getAvatar: function(req, res) {
		var imagepath = __dirname + '/../storage/avatars/' + req.params.image;
		fs.exists(imagepath, function(exists) {
			if ( ! exists) {
				imagepath = __dirname + '/../public/img/placeholder.png';
			}
			var image = fs.readFileSync(imagepath);

			res.writeHead(200, {'Content-Type': 'image/png' });
			res.end(image, 'binary');
		});
	},

	postAvatar: function(req, res) {
		var mimetypes = ['image/jpeg', 'image/png'];
		if (req.files.image && inArray(req.files.image.mimetype, mimetypes)) {
			var input = req.files.image.path;
			var output = '/var/www/feedbackspel.nl/storage/avatars/' + req.user._id + '.png';
			var command = 'convert ' + input + ' -resize "150x150^" -gravity center -crop 150x150+0+0 +repage ' + output;
			
			exec(command, function(err, stdout, stderr) {
				if (err) console.log(err);
				res.redirect('/dashboard');
				fs.unlink(input);
			});
		} else {
			fs.unlink(req.files.image.path);
			res.redirect('/dashboard');
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