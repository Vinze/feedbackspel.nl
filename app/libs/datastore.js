var Datastore = require('nedb');
var moment    = require('moment');
var db = {};

db.users = new Datastore({
	autoload: true,
	filename: __dirname + '/../storage/datastores/users.db'
});

db.users.findById = function(user_id, callback) {
	db.users.findOne({ _id: user_id }, { password: 0 }, callback);
};

db.users.findByEmail = function(email, callback) {
	db.users.findOne({ email: email }, { password: 0 }, callback);
};

db.users.findAll = function(callback) {
	db.users.find({}).sort({ email: 1 }).projection({ password: 0 }).exec(callback);
};

db.sessions = new Datastore({
	autoload: true,
	filename: __dirname + '/../storage/datastores/sessions.db'
});

db.sessions.findByToken = function(token, callback) {
	db.sessions.findOne({ token: token, expires: { $gt: moment().unix() } }, callback);
};

module.exports = db;