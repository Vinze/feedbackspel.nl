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

		db.sessions.findByToken(token, function(err, session) {
			if ( ! session && token) {
				res.clearCookie('jwtoken');
				return next();
			}
			try {
				var data = jwt.decode(session.token, config.jwt_secret);
				db.users.findById(data.user_id, function(err, user) {
					if ( ! user) return next();
					req.user = {
						_id: user._id,
						email: user.email,
						firstname: user.firstname,
						lastname: user.lastname,
						gender: user.gender,
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
		if (req.user && req.user.admin == true) {
			next();
		} else {
			res.redirect('/');
		}
	}

}

module.exports = auth;