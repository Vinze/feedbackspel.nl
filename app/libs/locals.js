var os = require('os');

module.exports = function(req, res, next) {
	res.locals.user = req.user;
	res.locals.message = req.flash('message');

	if (req.user) {
		res.locals.menu_items = [
			{ label: 'Dashboard', url: '/dashboard', classname: 'fa-home' },
			{ label: 'Mijn profiel', url: '/profile', classname: 'fa-user' },
			{ label: 'Uitloggen', url: '/logout', classname: 'fa-sign-out' }
		];
	} else {
		res.locals.menu_items = [
			{ label: 'Inloggen', url: '/login', classname: 'fa-sign-in' },
			{ label: 'Registreren', url: '/register', classname: 'fa-user' },
		];
	}

	// Temporary hide the sidebar icon until registration is finished
	if (req.user || os.hostname() != 'UbuntuVPS1') {
		res.locals.show_sidebar = true;
	} else {
		res.locals.show_sidebar = false;
	}

	next();
}