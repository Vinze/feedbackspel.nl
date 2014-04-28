var config = require('../config');
var mysql = require('mysql');

var db = mysql.createConnection(config.database);

module.exports = {
	findAll: function(callback) {
		db.query('SELECT * FROM users', function(err, rows) {
			callback(err, rows);
		});
	},
	insert: function(data, callback) {
		callback(null, data);
	}
}