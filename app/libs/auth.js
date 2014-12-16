var jwt     = require('jwt-simple');
var moment  = require('moment');
var config  = require('../libs/config');
var db      = require('../libs/datastore');

var auth = {

	tokenParser: function(req, res, next) {
		var token = (req.cookies && req.cookies.fbs_token) || 
		            (req.body && req.body.fbs_token) ||
		            (req.query && req.query.fbs_token) ||
		            req.headers['x-fbs_token'];
		req.token = token || null;
		req.user = null;

		if ( ! token) return next();

		function setUser(user) {
			req.user = {
				_id: user._id,
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
				gender: user.gender,
				image: user.image,
				admin: user.admin
			};
		}

		function validateToken(tokenData) {
			var age = moment().unix() - tokenData.iss;
			var maxAge = 3600 * 24 * 365;
			return (age < maxAge && tokenData.ip == req.connection.remoteAddress);
		}

		try {
			var tokenData = jwt.decode(token, config.jwt_secret);
			if (validateToken(tokenData)) {
				db.users.findById(tokenData.user_id, function(err, user) {
					if (user) setUser(user);
					next();
				});
			} else {
				console.log('INVALID TOKEN!!!!!!!')
				// res.clearCookie('fbs_token');
				next();
			}
		} catch(err) {
			console.log(err);
			next();
		}
	},

	setToken: function(user, req) {
		var tokenData = {
			user_id: user._id,
			ip: req.connection.remoteAddress,
			iss: moment().unix()
		};
		var token = jwt.encode(tokenData, config.jwt_secret);

		return token;
	},

	isMember: function(req, res, next) {
		if (req.user) {
			next();
		} else {
			res.redirect('/login');
		}
	},

	isGuest: function(req, res, next) {
		if (req.user) {
			res.redirect('/dashboard');
		} else {
			next();
		}
	},

	isAdmin: function(req, res, next) {
		if (req.user && req.user.admin == true) {
			next();
		} else {
			res.redirect('/');
		}
	}

}

module.exports = auth;