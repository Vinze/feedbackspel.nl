var Datastore = require('nedb');

module.exports = new Datastore({
	autoload: true,
	filename: __dirname + '/../storage/sessions.db'
});