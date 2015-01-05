var socketio  = require('socket.io');
var jwt       = require('jwt-simple');
var _         = require('underscore');
var moment    = require('moment');
var config    = require('../libs/config');
var auth      = require('../libs/auth');
var db        = require('../libs/datastore');
var Room      = require('../libs/gameroom');

var Game = new Room();

var cards = [
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
];

Game.setCards(cards);

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
					Game.setPlayer(user);
					client.emit('userId', user._id);
				}
				
				next();
			});
		});
	});

	io.on('connection', function(client) {

		function sendState() {
			io.in(client.room).emit('gamestate', Game.getState());
		}

		sendState();

		client.on('player.ready', function(rating) {
			_.each(rating, function(rating, toPlayerId) {
				Game.setFeedback({ from: client.playerId, to: toPlayerId, rating: rating });
			});
			Game.setPlayerStep(client.playerId, 2);
			sendState();
		});

		client.on('player.notready', function(rating) {
			Game.setPlayerStep(client.playerId, 1);
			sendState();
		});

		client.on('round.next', function() {
			Game.nextRound();
			io.in(client.room).emit('round.next', Game.getState());
		});

		client.on('player.remove', function(playerId) {
			if (client.role == 'host') {
				Game.removePlayer(playerId);
			} else {
				// Game.removePlayer(client.playerId);
			}
			sendState();
		});

		client.on('game.restart', function() {
			Game.resetState();
			sendState();
		});

		client.on('disconnect', function() {
			if (client.role == 'player') {
				Game.setPlayer({
					_id: client.playerId,
					status: 'disconnected'
				});
			}
			sendState();
		});

	});
}

module.exports = SocketController;