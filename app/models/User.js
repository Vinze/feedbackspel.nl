var Datastore = require('nedb');
var db = {
	users: new Datastore({
		filename: __dirname + '/../storage/users.db',
		autoload: true
	})
};

var User = {

	findById: function(user_id, callback) {
		db.users.findOne({ _id: user_id }, { password: 0 }, callback);
	},

	findByEmail: function(email, callback) {
		db.users.findOne({ email: email }, callback);
	},

	findAll: function(callback) {
		db.users.find({}, { password: 0 }, callback);
	},

	insert: function(input, callback) {
		db.users.insert(input, callback);
	},

	removeById: function(user_id, callback) {
		db.users.remove({ _id: user_id }, callback);
	}

};

module.exports = User;