var Datastore = require('nedb');
var db = {
	users: new Datastore({
		autoload: true,
		filename: __dirname + '/../storage/users.db'
	}),
	sessions: new Datastore({
		autoload: true,
		filename: __dirname + '/../storage/sessions.db'
	})
};

module.exports = db;