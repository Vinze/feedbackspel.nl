var socketio = require('socket.io');
var jwt      = require('jsonwebtoken');
var _        = require('underscore');
var moment   = require('moment');
var config   = require('../libs/config');
var db       = require('../libs/datastore');
var Gameroom = require('../libs/gameroom');

function findUser(userId, callback) {
	var fields = { _id: 1, email: 1, firstname: 1, lastname: 1, gender: 1 };
	db.users.findOne({ _id: userId }, fields, callback);
}

var SocketController = function(server) {
	var io = socketio.listen(server, { log: false });

	io.use(function(client, next) {
		var token = client.handshake.query.token;

		jwt.verify(token, config.jwt_secret, function(err, tokenData) {
			if (err) {
				console.err('Invalid token:', err);
				return;
			}

			findUser(tokenData.userId, function(err, user) {
				if ( ! user) return;

				client.playerId = user._id;
				client.email = user.email;
				client.role = client.handshake.query.role; // host or player
				client.room = client.handshake.query.room; // roomnumber

				client.join(client.room);

				if (client.role == 'player') {
					user.status = 'active';
					user.socketId = client.id;
					user.name = user.firstname + ' ' + user.lastname;
					user.room = client.room;
					Gameroom(client.room).setPlayer(user);
					client.emit('userId', user._id);
				}
				
				next();
			});
		});
	});

	io.on('connection', function(client) {

		function sendState() {
			var gamestate = Gameroom(client.room).getState();
			io.in(client.room).emit('gamestate', gamestate);
		}

		sendState();

		client.on('game.cards', function(cards) {
			Gameroom(client.room).setCards(cards);
			sendState();
		});

		client.on('player.ready', function(ratings) {
			_.each(ratings, function(rating, toPlayerId) {
				Gameroom(client.room).setFeedback({ from: client.playerId, to: toPlayerId, rating: rating });
			});
			Gameroom(client.room).setPlayerStep(client.playerId, 'feedbackSend');
			sendState();
		});

		client.on('player.notready', function(rating) {
			Gameroom(client.room).setPlayerStep(client.playerId, 'setRating');
			sendState();
		});

		client.on('round.next', function() {
			Gameroom(client.room).nextRound();
			io.in(client.room).emit('round.next', Gameroom(client.room).getState());
		});

		client.on('player.leave', function(playerId) {
			var player = Gameroom(client.room).getPlayer(playerId);

			if (player.status == 'disconnected') {
				Gameroom(client.room).removePlayer(playerId);
			} else {
				Gameroom(client.room).setPlayer({ _id: playerId, status: 'left' });
			}
			if (io.sockets.connected[player.socketId]) {
				io.sockets.connected[player.socketId].emit('game.leave');
			}
			sendState();
		});

		client.on('game.restart', function() {
			Gameroom(client.room).reset();
			sendState();
		});

		client.on('game.remove', function() {
			io.in(client.room).emit('game.leave');
			Gameroom(client.room).remove();
		});

		client.on('disconnect', function() {
			if (client.role == 'player') {
				var player = Gameroom(client.room).getPlayer(client.playerId);
				if (player && player.status == 'left') {
					Gameroom(client.room).removePlayer(client.playerId);
				} else {
					Gameroom(client.room).setPlayer({
						_id: client.playerId,
						status: 'disconnected'
					});
				}
			}
			sendState();
		});

	});
}

module.exports = SocketController;