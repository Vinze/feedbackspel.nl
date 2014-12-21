var os = require('os');

module.exports = function(req, res, next) {
	res.locals.user = req.user;
	res.locals.message = req.flash('message');

	if (req.user) {
		res.locals.menu_items = [
			{ label: 'Dashboard', url: '/start', classname: 'fa-home' },
			// { label: 'Mijn profiel', url: '/profile', classname: 'fa-user' },
			{ label: 'Uitloggen', url: '/uitloggen', classname: 'fa-sign-out' }
		];
	} else {
		res.locals.menu_items = [
			{ label: 'Registreren', url: '/registreren', classname: 'fa-user' },
			{ label: 'Inloggen', url: '/inloggen', classname: 'fa-sign-in' },
		];
	}

	// Temporary hide the sidebar icon until registration is finished
	if (req.user || os.hostname() != 'UbuntuVPS1') {
		res.locals.show_sidebar = true;
	} else {
		res.locals.show_sidebar = true;
	}

	next();
}