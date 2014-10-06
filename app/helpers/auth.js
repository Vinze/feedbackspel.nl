var jwt    = require('jwt-simple');
var config = require('../config');

var auth = {
	loggedIn: function(req, res, next) {
		if (req.cookies.token) {
			var data = jwt.decode(req.cookies.token, config.jwt_secret);
			if (data.iat < new Date().getTime()) {
				console.log('expired!!');
			}
			console.log(req.user);
			next();
		} else {
			res.redirect('/');
		}
	}
}

module.exports = auth;