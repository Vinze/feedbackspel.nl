var socketio = require('socket.io');
var jwt      = require('jwt-simple');
var _        = require('underscore');
var moment   = require('moment');
var config   = require('../libs/config');
var auth     = require('../libs/auth');
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

		auth.validateToken(token, function(err, tokenData) {
			if (err) {
				console.log('Token error:', err);
				return;
			}

			findUser(tokenData.userId, function(err, user) {
				if ( ! user) return;

				client.playerId = user._id;
				client.role = client.handshake.query.role; // host or player
				client.room = client.handshake.query.room; // roomnumber

				client.join(client.room);

				if (client.role == 'player') {
					user.status = 'active';
					user.socketId = client.id;
					user.name = user.firstname + ' ' + user.lastname;
					user.room = client.room;
					Gameroom().setPlayer(user);
					client.emit('userId', user._id);
				} else if (client.role == 'host') {
					Gameroom(client.room).setCards([
						'Betrouwbaar',
						'Geduldig',
						'Roekeloos',
						'Creatief',
						'Prikkelbaar',
						'Saai',
						'Doorzetter',
						'Kritisch',
						'Onzichtbaar',
						'Luidruchtig',
						'Sociaal',
						'Optimistisch',
						'Gedisciplineerd',
						'Nieuwsgierig',
						'Snel afgeleid'
					]);
				}
				
				next();
			});
		});
	});

	io.on('connection', function(client) {

		if (client.role == 'player') {
			console.log(client);
		}


		function sendState() {
			var gamestate = Gameroom(client.room).getState();
			io.in(client.room).emit('gamestate', gamestate);
		}

		sendState();

		client.on('player.ready', function(rating) {
			_.each(rating, function(rating, toPlayerId) {
				Gameroom(client.room).setFeedback({ from: client.playerId, to: toPlayerId, rating: rating });
			});
			Gameroom().setPlayerStep(client.playerId, 2);
			sendState();
		});

		client.on('player.notready', function(rating) {
			Gameroom().setPlayerStep(client.playerId, 1);
			sendState();
		});

		client.on('round.next', function() {
			Gameroom(client.room).nextRound();
			io.in(client.room).emit('round.next', Game.getState());
		});

		client.on('player.remove', function(playerId) {
			if (client.role == 'host') {
				Gameroom().removePlayer(playerId);
			} else {
				// Game.removePlayer(client.playerId);
			}
			sendState();
		});

		client.on('game.restart', function() {
			Gameroom(client.room).reset();
			sendState();
		});

		client.on('disconnect', function() {
			if (client.role == 'player') {
				Gameroom().setPlayer({
					_id: client.playerId,
					status: 'disconnected'
				});
			}
			sendState();
		});

	});
}

module.exports = SocketController;