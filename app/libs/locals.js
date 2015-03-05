var os     = require('os');
var moment = require('moment');
var config = require('./config');

module.exports = function(req, res, next) {
	res.locals.user = req.user;
	res.locals.message = req.flash('message');

	res.locals.baseURL = config.baseURL;

	res.locals.pageTitle = 'Feedbackspel.nl';

	if (req.user) {
		res.locals.menu_items = [
			{ label: 'Dashboard', url: '/dashboard', classname: 'fa-home' },
			{ label: 'Uitloggen', url: '/uitloggen', classname: 'fa-sign-out' }
		];
	} else {
		res.locals.menu_items = [
			{ label: 'Inloggen', url: '/start', classname: 'fa-sign-in' },
			{ label: 'Registreren', url: '/start', classname: 'fa-user' }
		];
	}

	// Temporary hide the sidebar icon until registration is finished
	if (req.user || os.hostname() != 'UbuntuVPS1') {
		res.locals.show_sidebar = true;
	} else {
		res.locals.show_sidebar = true;
	}

	res.locals.currentYear = moment().format('YYYY');

	next();
}