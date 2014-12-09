var Datastore = require('nedb');
var db = {};

db.users = new Datastore({
	autoload: true,
	filename: __dirname + '/../storage/datastores/users2.db'
});

var UserController2 = {

	getUsers: function() {
		db.users.find({}, function(err, users) {
			res.json(users);
		});
	}

}

module.exports = UserController2;