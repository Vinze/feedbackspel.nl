var socketio = require('socket.io');
var jwt      = require('jwt-simple');
var config   = require('../config');

var SocketController = function(server) {
	var io = socketio.listen(server, { log: false });

	io.on('connection', function(client) {

		var token = client.handshake.query.jwtoken;

		client.user = jwt.decode(token, config.jwt_secret);

		client.on('message', function(message) {
			io.sockets.emit('message', {
				text: message,
				from: client.user.firstname + ' ' + client.user.lastname
			});
		});


		client.on('disconnect', function() {
			
		});

	});

}

module.exports = SocketController;