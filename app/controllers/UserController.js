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
		res.render('start');
	},

	getDashboard: function(req, res) {
		if (req.user.image) {
			var intendedURL = req.flash('intendedURL');
			if (intendedURL) {
				res.redirect(intendedURL);
			} else {
				res.render('dashboard');
			}
		} else {
			res.render('select-avatar');
		}
	},

	getIndex: function(req, res) {
		res.render('users');
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
 			var input = req.files.image.path;
			
			if ( ! inArray(req.files.image.mimetype, mimetypes)) {
				fs.unlink(input, function(err) {
					if (err) console.log(err);
				});
				return res.redirect('/start');
			}

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

	postLogin: function(req, res) {
		var input = req.body;
		db.users.findOne({ email: input.email }, function(err, user) {
			if ( ! user) {
				return res.json({ error: 'Het opgegeven e-mail adres werd niet gevonden.' });
			}
			var token = auth.setToken(user, req);
			res.json({ error: null, token: token });

			// bcrypt.compare(input.password, user.password, function(err, match) {
			// 	if ( ! match) {
			// 		return res.json({ error: 'Het opgegeven wachtwoord is onjuist.' });
			// 	}
			// 	var token = auth.setToken(user, req);

			// 	res.json({ error: null, token: token });
			// });
		});
	},

	postRegister: function(req, res) {
		var input = req.body;
		var rules = {
			email: { required: true, email: true, minlength: 4, maxlength: 60 },
			firstname: { required: true },
			lastname: { required: true }
			// password: { required: true, minlength: 3 },
			// password2: { required: true, same: 'password' }
		};
		validate(input, rules, function(errors) {
			if (errors) return res.json({ error: 'Validatie mislukt.' });

			db.users.findOne({ email: input.email.toLowerCase() }, function(err, user) {
				if (user) return res.json({ error: 'E-mail adres is reeks in gebruik.' });

				db.users.insert({
					email: input.email.toLowerCase(),
					password: bcrypt.hashSync(input.password),
					firstname: input.firstname,
					lastname: input.lastname,
					image: false,
					admin: false,
					created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
					updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
				}, function(err, user) {
					if (err) return res.json({ error: 'Fout bij het registeren van het account.' });
					var token = auth.setToken(user, req);
					res.json({ error: false, token: token });
				});
			});


		});
	},

	postCheckEmail: function(req, res) {
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
		if ( ! req.body._id) return;

		var input = {
			email: req.body.email.toLowerCase(),
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
		}

		if (typeof req.body.image !== 'undefined') {
			input.image = req.body.image == 'true' ? true : false;
		}

		if (typeof req.body.admin !== 'undefined') {
			input.admin = req.body.admin == 'true' ? true : false;
		}

		db.users.update({ _id: req.body._id }, { $set: input }, {}, function(err, numUpdated) {
			if (err) console.log(err);
			db.users.find({}, { password: 0 }, function(err, users) {
				res.json(users);
			});
		});
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
	},

	getLogout: function(req, res) {
		res.clearCookie('fbs_token');
		res.redirect('/');
	}
	
};

module.exports = UserController;