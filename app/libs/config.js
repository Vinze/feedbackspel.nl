var os = require('os');

var config = {
	port: 1337,
	token_expires: 365, // days
	jwt_secret: 'EXWufyfRbW5xgSngpi8z',
	cookie_secret: 'aBIaocaJ9EHpcDu4GsZy',
	session_secret: '4rDl40UJSXq0lTUpPLWx'
}

if (os.hostname() == 'UbuntuVPS1') {
	config.database = 'mysql://root:W3bW8woord@localhost/feedbackspel.nl';
} else {
	config.database = 'mysql://root:usbw@localhost/feedbackspel.nl';
}

module.exports = config;