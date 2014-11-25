var socketio  = require('socket.io');
var jwt       = require('jwt-simple');
var _         = require('underscore');
var moment    = require('moment');
var async     = require('async');
var db        = require('../libs/datastore');
var config    = require('../libs/config');
var Room      = require('../libs/gameroom.js');

var cards = [
	'Betrouwbaar', 'Geduldig', 'Roekeloos',
	'Prikkelbaar', 'Doorzetter', 'Luidruchtig',
	'Sociaal', 'Nieuwsgierig', 'Snel afgeleid'
];

var Game = new Room();

Game.setCards(cards);

function findUser(userId, callback) {
	var fields = { _id: 1, email: 1, firstname: 1, lastname: 1, gender: 1 };
	db.users.findOne({ _id: userId }, fields, callback);
}

var SocketController = function(server) {
	var io = socketio.listen(server, { log: false });

	function sendState() {
		io.emit('gamestate', Game.getState());
	}

	io.on('connection', function(socket) {

		var token = socket.handshake.query.token;
		socket.role = socket.handshake.query.role; // host or player

		try {
			var data = jwt.decode(token, config.jwt_secret);
			findUser(data.user_id, function(err, user) {
				socket.playerId = user._id;
				if (socket.role == 'player') {
					user.status = 'active';
					user.socketId = socket.id;
					user.name = user.firstname + ' ' + user.lastname;
					Game.setPlayer(user);
				}
				sendState();
			});
		} catch(err) {
			console.log(err);
		}

		socket.on('player.ready', function(rating) {
			_.each(rating, function(rating, toPlayerId) {
				Game.setFeedback({ from: socket.playerId, to: toPlayerId, rating: rating });
			});
			Game.setPlayerStep(socket.playerId, 2);
			sendState();
		});

		socket.on('round.next', function() {
			Game.nextRound();
			io.emit('round.next', Game.getState());
		});

		socket.on('player.remove', function(playerId) {
			Game.removePlayer(playerId);
			sendState();
		});

		socket.on('disconnect', function() {
			Game.setPlayer({
				_id: socket.playerId,
				status: 'disconnected'
			});
			sendState();
		});

	});
}

module.exports = SocketController;