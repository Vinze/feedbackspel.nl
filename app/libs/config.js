var os = require('os');

var config = {
	port: 1337,
	token_expires: 365, // days
	jwt_secret: 'KwIeAC2Lu3toL1q7a88c',
	cookie_secret: 'aBIaocaJ9EHpcDu4GsZy',
	session_secret: '4rDl40UJSXq0lTUpPLWx',
	database: 'mysql://root:usbw@localhost/feedbackspel.nl'
}

if (os.hostname() == 'UbuntuVPS1') {
	config.database = 'mysql://root:W3bW8woord@localhost/feedbackspel.nl';
}

module.exports = config;