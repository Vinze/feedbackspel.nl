var socketio = require('socket.io');
var jwt      = require('jwt-simple');
var config   = require('../libs/config');
var moment   = require('moment');

var messages = [];

var SocketController = function(server) {
	var io = socketio.listen(server, { log: false });

	io.on('connection', function(client) {

		var token = client.handshake.query.jwtoken;

		client.user = jwt.decode(token, config.jwt_secret);

		client.emit('chat.history', messages);

		var message = {
			text: client.user.firstname + ' ' + client.user.lastname + ' heeft zich aangesloten bij de ​​chat.',
			time: moment().format('HH:mm')
		};
		io.sockets.emit('chat.message', message);
		messages.push(message);

		client.on('chat.message', function(text) {
			var message = {
				text: text,
				from: client.user.firstname + ' ' + client.user.lastname,
				time: moment().format('HH:mm')
			}
			messages.push(message);
			io.sockets.emit('chat.message', message);
		});

		client.on('chat.clear', function() {
			io.sockets.emit('chat.clear');
			messages = [];
		});


		client.on('disconnect', function() {
			var message = {
				text: client.user.firstname + ' ' + client.user.lastname + ' heeft de chat verlaten.',
				time: moment().format('HH:mm')
			};
			io.sockets.emit('chat.message', message);
			messages.push(message);

		});

	});

}

module.exports = SocketController;