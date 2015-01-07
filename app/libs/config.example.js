var os = require('os');

var config = {
	port: 1337,
	token_expires: 365, // days
	base: 'http://localhost:1337/',
	jwt_secret: 'secret',
	cookie_secret: 'secret',
	session_secret: 'secret',
	database: 'mysql://user:password@localhost/database'
}

if (os.hostname() == 'MyHostname') {
	config.base = 'http://website.com/';
}

module.exports = config;