var socketio = require('socket.io');
var jwt      = require('jwt-simple');
var config   = require('../config');

var SocketController = function(server) {
	var io = socketio.listen(server, { log: false });

	io.on('connection', function(client) {
		
		var token = client.handshake.query.jwtoken;

		var token_data = jwt.decode(token, config.jwt_secret);

		console.log(token_data);
		console.log('a user connected');

		client.on('disconnect', function() {
			console.log('user disconnected');
		});

	});

}

module.exports = SocketController;