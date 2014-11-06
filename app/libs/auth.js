var jwt     = require('jwt-simple');
var moment  = require('moment');
var config  = require('../libs/config');
var User    = require('../models/User');
var Session = require('../models/Session');

var auth = {

	tokenParser: function(req, res, next) {
		var token = (req.cookies && req.cookies.jwtoken) || 
		            (req.body && req.body.jwtoken) ||
		            (req.query && req.query.jwtoken) ||
		            req.headers['x-jwtoken'];
		req.user = null;

		Session.findOne({ token: token, expires: { $gt: moment().unix() } }, function(err, session) {
			if ( ! session) {
				res.clearCookie('jwtoken');
				return next();
			}
			try {
				var data = jwt.decode(session.token, config.jwt_secret);
				User.findOne({ _id: data.user_id }, function(err, user) {
					req.user = {
						_id: user._id,
						email: user.email,
						firstname: user.firstname,
						lastname: user.lastname,
						admin: user.admin
					};
					next();
				});
			} catch(err) {
				console.log(err);
				next();
			}
		});
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
		if (req.user && req.user.admin == 'true') {
			next();
		} else {
			res.redirect('/');
		}
	}

}

module.exports = auth;