var socketio = require('socket.io');
var jwt      = require('jwt-simple');
var db       = require('../libs/datastore');
var config   = require('../libs/config');
var moment   = require('moment');

var users = [];

var SocketController = function(server) {
	var io = socketio.listen(server, { log: false });

	function sendUsers() {
		io.sockets.emit('users.list', users);
	}

	io.on('connection', function(client) {

		var token = client.handshake.query.token;

		client.role = client.handshake.query.role;

		try {
			var data = jwt.decode(token, config.jwt_secret);
			db.users.findById(data.user_id, function(err, user) {
				users.push(user);
				client.user = user;
				sendUsers();
			});
		} catch(err) {
			console.log(err);
		}

		// client.user = jwt.decode(token, config.jwt_secret);
		// client.user.fullname = client.user.firstname + ' ' + client.user.lastname;

		
		client.on('disconnect', function() {
			users.splice(users.indexOf(client.user), 1);
			sendUsers();
		});

	});
}

module.exports = SocketController;