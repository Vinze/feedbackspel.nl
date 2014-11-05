var mysql    = require('mysql');

var db = mysql.createConnection({
	host:     'localhost',
	user:     'root',
	password: 'usbw'
});

db.connect();

var User = {

	findById: function(user_id, callback) {
		var sql = 'SELECT id, email, firstname, lastname FROM users WHERE id = ?';
		db.query(sql, user_id, function(err, rows, fields) {
			callback(err, rows[0]);
		});
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

	updateById: function(user_id, input, callback) {

	},

	removeById: function(user_id, callback) {
		db.users.remove({ _id: user_id }, callback);
	}

};

module.exports = User;