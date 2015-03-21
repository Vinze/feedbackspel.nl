var moment = require('moment');
var config = require('./config');

module.exports = function(req, res, next) {
	res.locals.user = req.user;
	// res.locals.message = req.flash('message');

	res.locals.baseURL = config.baseURL;

	res.locals.pageTitle = 'Feedbackspel.nl';

	res.locals.currentYear = moment().format('YYYY');

	next();
}