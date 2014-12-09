var bcrypt   = require('bcrypt-nodejs');
var crypto   = require('crypto');
var fs       = require('fs');
var jwt      = require('jwt-simple');
var moment   = require('moment');
var _        = require('underscore');
var exec     = require('child_process').exec;
var validate = require('../libs/validator');
var config   = require('../libs/config');
var db       = require('../libs/datastore');

function inArray(needle, haystack) {
	return haystack.indexOf(needle) != -1;
}

var UserController = {

	getAvatar: function(req, res) {
		var imagepath = './storage/avatars/' + req.params.image;
		fs.exists(imagepath, function(exists) {
			if ( ! exists) {
				imagepath = './storage/avatars/placeholder.png';
			}
			var image = fs.readFileSync(imagepath);

			res.writeHead(200, {'Content-Type': 'image/png' });
			res.end(image, 'binary');
		});
	},

	postStart: function(req, res) {
		if ( ! req.body.email) return res.json({ error: 'Geen geldig e-mail adres!' });

		var email = req.body.email.trim();
		var code = crypto.randomBytes(16).toString('hex');

		db.users.update({ email: email }, { $set: { code: code } }, { upsert: true });

		res.json({ code: code });

		// Users.update({ email: email }, { $set: { code: code } }, { upsert: true });

		// if (sendMail) {
		// 	var loginURL = 'http://localhost:1337/login?code=' + code + '&email=' + email;
		// 	var options = {
		// 		from: 'Feedbackspel.nl <info@feedbackspel.nl>',
		// 		to: email,
		// 		subject: 'E-mail confirmation at feedbackspel.nl',
		// 		text: 'Please click the following link to login:\n\n' + loginURL
		// 	};
		// 	transporter.sendMail(options, function(err, info) {
		// 		if (err) {
		// 			console.log('Error sending e-mail: ', err);
		// 		} else {
		// 			console.log('E-mail sent: ' + info.response);
		// 			console.log(info);
		// 		}
		// 	});
		// }

		// res.redirect('/email?email=' + email + '&code=' + code);
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

				var expires = moment().add(1, 'years');
				var token = jwt.encode({ user_id: user._id }, config.jwt_secret);

				// db.sessions.insert({
				// 	user_id: user._id,
				// 	token: token,
				// 	expires: expires.unix(),
				// 	ipaddress: req.connection.remoteAddress
				// }, function(err, doc) {
				// 	if (err) console.log('error inserting token', err);
				// });

				res.json({
					error: null,
					token: token,
					user: _.omit('password')
				});
			});

		});
	},

	getUser: function(req, res) {
		res.json(res.user);
	}
	
};

module.exports = UserController;