var socketio  = require('socket.io');
var jwt       = require('jwt-simple');
var Datastore = require('nedb');
var _         = require('underscore');
var moment    = require('moment');
var db        = require('../libs/datastore');
var config    = require('../libs/config');

var players = new Datastore();
var ratings = new Datastore();

var cards = ['Betrouwbaar', 'Geduldig', 'Roekeloos'];
var round = 0;

var SocketController = function(server) {
	var io = socketio.listen(server, { log: false });

	function sendPlayers() {
		players.find({}).sort({ firstname: 1 }).exec(function(err, users) {
			var ready = _.reduce(users, function(memo, user) {
				return user.ready && user.status != 'left' ? memo + 1 : memo;
			}, 0);
			io.sockets.emit('users.updated', users);
			io.sockets.emit('users.ready', ready);
		});
	}

	function sendCard() {
		io.sockets.emit('card.new', cards[round]);
		if (round == cards.length - 1) {
			round = 0;
		} else {
			round++;
		}
	}

	function sendRatings() {
		ratings.find({}, function(err, results) {
			io.sockets.emit('ratings',  results);
		});
	}

	function sendStatus(client, status) {
		client.emit('status', status);
	}

	
	function newUser(client) {
	}

	io.on('connection', function(client) {
		var token = client.handshake.query.token;
		client.role = client.handshake.query.role; // host or player

		try {
			var data = jwt.decode(token, config.jwt_secret);
			db.users.findById(data.user_id, function(err, user) {
				client.user_id = user._id;
				if (client.role == 'player') {
					players.findOne({ _id: client.user_id }, function(err, player) {
						if ( ! player) {
							user.ready = false;
						}
						user.status = 'active';
						user.socket_id = client.id;
						players.update({ _id: client.user_id }, { $set: user }, { upsert: true }, sendPlayers);
						sendStatus(client, user.ready);
					});
				} else {
					sendPlayers();
					// sendCard();
				}
			});
		} catch(err) {
			console.log(err);
		}

		client.on('user.ready', function(data) {
			var rating = { user_id: client.user_id, ratings: data };
			players.update({ _id: client.user_id }, { $set: { ready: true } }, sendPlayers);

			ratings.update({ user_id: client.user_id }, rating, { upsert: true }, function(err) {
				ratings.find({}, function(err, ratings) {
					// console.log(ratings);
				});
			});
			
		});

		client.on('ratings.get', function() {
			sendRatings();
		});

		client.on('round.next', function() {
			// players.update({}, { $set: { ready: false } }, { multi: true }, function() {
			// 	sendUsers();
			// });
		});

		client.on('user.remove', function(user_id) {
			if (user_id && client.role == 'host') {
				players.remove({ _id: user_id }, sendPlayers);
			}
		});

		client.on('disconnect', function() {
			if (client.role == 'player') {
				players.update({ _id: client.user_id }, { $set: { status: 'disconnected' } }, sendPlayers);
			}
		});

	});
}

module.exports = SocketController;