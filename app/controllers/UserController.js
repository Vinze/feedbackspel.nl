var bcrypt   = require('bcrypt-nodejs');
var jwt      = require('jwt-simple');
var moment   = require('moment');
var fs       = require('fs');
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

				res.cookie('fbs_token', token, { maxAge: expires.diff(moment()) });
				res.json({  error: null, token: token });
			});

		});
	}
	
};

module.exports = UserController;