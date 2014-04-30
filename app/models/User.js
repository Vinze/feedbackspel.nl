var config = require('../config');
var mysql = require('mysql');

var db = mysql.createConnection(config.database);

module.exports = {
	findAll: function(cb) {
		db.query('SELECT * FROM users', function(err, rows) {
			cb(err, rows);
		});
	},
	insert: function(data, cb) {
		data.created_at = new Date();
		data.updated_at = new Date();
		db.query('INSERT INTO users SET ?', data, cb);
	}
}