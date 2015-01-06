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

		auth.validateToken(token, function(err, tokenData) {
			if (err) {
				console.log('Invalid token:', err);
				return next();
			}
			db.users.findById(tokenData.userId, function(err, user) {
				if (user) {
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
				next();
			});
		});

		// try {
		// 	var tokenData = jwt.decode(token, config.jwt_secret);
		// 	if (auth.validateToken(tokenData, req)) {
		// 		db.users.findById(tokenData.userId, function(err, user) {
		// 			if (user) setUser(user);
		// 			next();
		// 		});
		// 	} else {
		// 		res.clearCookie('fbs_token');
		// 		next();
		// 	}
		// } catch(err) {
		// 	console.log(err);
		// 	next();
		// }
	},

	// validateToken: function(tokenData, req) {
	// 	var age = moment().unix() - tokenData.iss;
	// 	var maxAge = 3600 * 24 * 365;
	// 	return (age < maxAge && tokenData.ip == req.connection.remoteAddress);
	// },

	validateToken: function(token, callback) {
		if (token) {
			try {
				var tokenData = jwt.decode(token, config.jwt_secret);
				var age = moment().unix() - tokenData.iss;
				var maxAge = 3600 * 24 * 365;

				if (age < maxAge) {
					callback(null, tokenData);
				} else {
					callback('max age expired');
				}
			} catch(err) {
				callback(err);
			}
		} else {
			callback('no token');
		}
	},

	setToken: function(user, req) {
		var tokenData = {
			userId: user._id,
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
			res.redirect('/inloggen');
		}
	},

	isGuest: function(req, res, next) {
		if (req.user) {
			res.redirect('/start');
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