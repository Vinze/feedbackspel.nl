var jwt    = require('jwt-simple');
var moment = require('moment');
var config = require('../libs/config');
var User   = require('../models/User')

var auth = {

	jwtokenParser: function(req, res, next) {
		var token = (req.cookies && req.cookies.jwtoken) || (req.body && req.body.jwtoken) || (req.query && req.query.jwtoken) || req.headers['x-jwtoken'];
		req.user = null;

		if (token) {
			try {
				var token_data = jwt.decode(token, config.jwt_secret);
				if (token_data.expires <= moment().unix()) {
					res.clearCookie('jwtoken');
					next();
				} else {
					User.findById(token_data.user_id, function(err, user) {
						req.user = user;
						next();
					});
				}
			} catch(err) {
				console.log(err);
				next();
			}
		} else {
			next();
		}
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
	}

}

module.exports = auth;