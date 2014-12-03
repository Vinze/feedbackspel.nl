var socketio  = require('socket.io');
var jwt       = require('jwt-simple');
var _         = require('underscore');
var moment    = require('moment');
var async     = require('async');
var db        = require('../libs/datastore');
var config    = require('../libs/config');
var Room      = require('../libs/gameroom');


var Game = new Room();

Game.setCards([
	'Betrouwbaar', 'Geduldig', 'Roekeloos',
	'Prikkelbaar', 'Doorzetter', 'Luidruchtig',
	'Sociaal', 'Nieuwsgierig', 'Snel afgeleid'
]);

function findUser(userId, callback) {
	var fields = { _id: 1, email: 1, firstname: 1, lastname: 1, gender: 1 };
	db.users.findOne({ _id: userId }, fields, callback);
}

var SocketController = function(server) {
	var io = socketio.listen(server, { log: false });

	function sendState() {
		io.emit('gamestate', Game.getState());
	}

	io.on('connection', function(client) {

		var token = client.handshake.query.token;
		client.role = client.handshake.query.role; // host or player
		client.room = client.handshake.query.room; // roomnumber

		try {
			var data = jwt.decode(token, config.jwt_secret);
			findUser(data.user_id, function(err, user) {
				client.playerId = user._id;
				if (client.role == 'player') {
					user.status = 'active';
					user.socketId = client.id;
					user.name = user.firstname + ' ' + user.lastname;
					Game.setPlayer(user);
					client.emit('userId', user._id);
				}
				sendState();
			});
		} catch(err) {
			console.log(err);
		}

		client.on('player.ready', function(rating) {
			_.each(rating, function(rating, toPlayerId) {
				Game.setFeedback({ from: client.playerId, to: toPlayerId, rating: rating });
			});
			Game.setPlayerStep(client.playerId, 2);
			sendState();
		});

		client.on('round.next', function() {
			Game.nextRound();
			io.emit('round.next', Game.getState());
		});

		client.on('player.remove', function(playerId) {
			if (client.role == 'host') {
				Game.removePlayer(playerId);
			} else {
				// Game.removePlayer(client.playerId);
			}
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