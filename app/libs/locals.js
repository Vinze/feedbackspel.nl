var moment = require('moment');
var config = require('./config');

module.exports = function(req, res, next) {
	res.locals.user = req.user;
	// res.locals.message = req.flash('message');

	res.locals.baseURL = config.baseURL;

	res.locals.pageTitle = 'Feedbackspel.nl';

	res.locals.metaDescription = 'Welkom op feedbackspel.nl! Hier kun je gratis en eenvoudig een online feedback spelen met je collega\'s, medestudenten of vrienden.';

	res.locals.metaKeywords = 'feedback, feedbackspel, geven, ontvangen, online, gratis, gesprek, groeien';

	res.locals.currentYear = moment().format('YYYY');

	next();
}