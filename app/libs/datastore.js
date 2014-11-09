var Datastore = require('nedb');
var db = {};

db.users = new Datastore({
	autoload: true,
	filename: __dirname + '/../storage/users.db'
});

db.users.findById = function(user_id, callback) {
	db.users.findOne({ _id: user_id }, { password: 0 }, callback);
};

db.users.findByEmail = function(email, callback) {
	db.users.findOne({ email: email }, { password: 0 }, callback);
};

db.sessions = new Datastore({
	autoload: true,
	filename: __dirname + '/../storage/sessions.db'
});

module.exports = db;