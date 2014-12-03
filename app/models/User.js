var orm    = require('orm');
var config = require('../libs/config')

orm.connect(config.database, function(err, db) {
	var User = db.define('users', {
		email: String,
		password: String
	});

	User.find(function(err, users) {
		console.log(users);
	});

	module.exports = User;

});

