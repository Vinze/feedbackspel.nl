// var bcrypt   = require('bcrypt-nodejs');
var moment   = require('moment');
var fs       = require('fs');
var path     = require('path');
var spawn    = require('child_process').spawn;
var auth     = require('../libs/auth');
var validate = require('../libs/validator');
var db       = require('../libs/datastore');

function inArray(needle, haystack) {
	return haystack.indexOf(needle) != -1;
}

function capitalizeWords(str) {
	return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
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
		var imagepath = path.resolve('storage/avatars', req.params.image);

		fs.exists(imagepath, function(exists) {
			if ( ! exists) {
				imagepath = path.resolve('public/img/placeholder.png');
			}
			fs.readFile(imagepath, function(err, data) {
				res.writeHead(200, {'Content-Type': 'image/png' });
				res.end(data, 'binary');
			});
		});
	},

	postAvatar: function(req, res) {
		var image = req.files.image;
		var output = path.resolve('storage/avatars', req.user._id + '.png');

		if ( ! inArray(image.mimetype, ['image/jpeg', 'image/png']))
			return res.json({ error: 'Uploaded file is no image' });
		
		var convert = spawn('convert', [image.path, '-resize', '150x150^', '-gravity', 'center', '-crop', '150x150+0+0', '+repage', '-auto-orient', output]);

		convert.on('close', function (code) {
			db.users.update({ _id: req.user._id }, { $set: { image: true } }, function(err) {
				if (err) console.log(err);
			});

			res.json({ success: 'Image saved' });

			fs.unlink(image.path);
		});
	},

	postLogin: function(req, res) {
		var input = req.body;
		db.users.findOne({ email: input.email }, function(err, user) {
			if ( ! user) {
				return res.json({ exists: false });
			}

			var token = auth.setToken(user, req);

			res.json({ exists: true, token: token });
		});
	},

	// bcrypt.compare(input.password, user.password, function(err, match) {
	// 	if ( ! match) {
	// 		return res.json({ error: 'Het opgegeven wachtwoord is onjuist.' });
	// 	}
	// 	var token = auth.setToken(user, req);

	// 	res.json({ error: null, token: token });
	// });

	postRegister: function(req, res) {
		var input = req.body;
		var rules = {
			email: { required: true, email: true, minlength: 4, maxlength: 60 },
			firstname: { required: true },
			lastname: { required: true }
		};
		validate(input, rules, function(errors) {
			if (errors) return res.json({ error: 'Validatie mislukt.' });

			db.users.findOne({ email: input.email.toLowerCase() }, function(err, user) {
				if (user) return res.json({ error: 'E-mail adres is reeks in gebruik.' });

				db.users.insert({
					email: input.email.toLowerCase(),
					// password: bcrypt.hashSync(input.password),
					firstname: capitalizeWords(input.firstname),
					lastname: capitalizeWords(input.lastname),
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

	getUser: function(req, res) {
		res.json(req.user);
	},

	getUsers: function(req, res) {
		db.users.findAll(function(err, users) {
			res.json(users);
		});
	},

	postSave: function(req, res) {
		var input = {
			_id: (req.user.admin == true) ? req.body._id : req.user._id,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
		}

		if (req.user.admin == true) {
			input.email = req.body.email.toLowerCase();

			if (typeof req.body.image !== 'undefined') {
				input.image = req.body.image == 'true' ? true : false;
			}

			if (typeof req.body.admin !== 'undefined') {
				input.admin = req.body.admin == 'true' ? true : false;
			}

			db.users.update({ _id: input._id }, { $set: input }, {}, function(err, numUpdated) {
				if (err) console.log(err);
				db.users.findById(req.user._id, function(err, user) {
					res.json({ error: null, user: user });
				});
			});
		} else {
			var rules = {
				_id: { required: true },
				firstname: { required: true },
				lastname: { required: true }
			};

			validate(input, rules, function(errors) {
				if (errors) return res.json({ error: 'Niet alle verplichte velden zijn (correct) ingevuld.' });

				db.users.update({ _id: input._id }, { $set: input }, {}, function(err, numUpdated) {
					if (err) console.log(err);
					db.users.findById(req.user._id, function(err, user) {
						res.json({ error: null, user: user });
					});
				});
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
	},

	getLogout: function(req, res) {
		res.clearCookie('fbs_token');
		res.redirect('/');
	}
	
};

module.exports = UserController;