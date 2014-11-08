var os = require('os');

module.exports = function(req, res, next) {
	res.locals.user = req.user;
	res.locals.message = req.flash('message');

	// Temporary hide the sidebar icon until registration is finished
	if (req.user || os.hostname() != 'UbuntuVPS1') {
		res.locals.show_sidebar = true;
	} else {
		res.locals.show_sidebar = false;
	}

	next();
}