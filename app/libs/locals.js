var os     = require('os');
var moment = require('moment');
var config = require('./config');

module.exports = function(req, res, next) {
	res.locals.user = req.user;
	// res.locals.message = req.flash('message');

	res.locals.baseURL = config.baseURL;

	res.locals.pageTitle = 'Feedbackspel.nl';

	if (req.user) {
		res.locals.menuItems = [
			{ label: 'Dashboard', url: '/dashboard', classname: 'fa-home' }
		];
	} else {
		res.locals.menuItems = [
			{ label: 'Start', url: '/start', classname: 'fa-sign-in' }
		];
	}

	res.locals.currentYear = moment().format('YYYY');

	next();
}