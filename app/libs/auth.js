var jwt     = require('jsonwebtoken');
var moment  = require('moment');
var _       = require('underscore');
var config  = require('../libs/config');
var db      = require('../libs/datastore');

var auth = {

	tokenParser: function(req, res, next) {
		var token = (req.cookies && req.cookies.fbs_token) || // Get token from cookie
		            (req.body && req.body.token) || // Get token from POST data
		            (req.query && req.query.token) ||  // Get token from GET data
		            req.headers['x-token'] || null; // Get token from headers
		req.token = token;
		req.user = null;

		if ( ! token) return next();

		jwt.verify(token, config.jwt_secret, function(err, tokenData) {
			if (err) {
				console.error('Invalid token:', err);
				return next();
			}

			db.users.findById(tokenData.userId, function(err, user) {
				if (user) {
					req.user = _.pick(user, '_id', 'email', 'firstname', 'lastname', 'image', 'admin');
				}
				next();
			});
		});

	},

	setToken: function(user, req) {
		var payload = {
			userId: user._id,
			ip: req.connection.remoteAddress,
			exp: moment().add(6, 'months').unix()
		};
		var token = jwt.sign(payload, config.jwt_secret);

		return token;
	},

	isMember: function(req, res, next) {
		if (req.user) {
			next();
		} else {
			req.flash('intendedURL', req.url);
			res.redirect('/start');
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