var socketio  = require('socket.io');
var jwt       = require('jwt-simple');
var Datastore = require('nedb');
var _         = require('underscore');
var moment    = require('moment');
var db        = require('../libs/datastore');
var config    = require('../libs/config');

var Players = new Datastore();
var Ratings = new Datastore();

var cards = ['Betrouwbaar', 'Geduldig', 'Roekeloos'];
var round = 0;

var SocketController = function(server) {
	var io = socketio.listen(server, { log: false });

	function sendPlayers() {
		Players.find({}).sort({ firstname: 1 }).exec(function(err, users) {
			var ready = _.reduce(users, function(memo, user) {
				return user.ready ? memo + 1 : memo;
			}, 0);
			io.emit('users.updated', users);
			io.emit('users.ready', ready);
		});
	}

	function sendCard() {
		io.emit('card.new', cards[round]);
		if (round == cards.length - 1) {
			round = 0;
		} else {
			round++;
		}
	}

	function sendRatings() {
		Ratings.find({}, function(err, results) {
			io.emit('ratings',  results);
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
					Players.findOne({ _id: client.user_id }, function(err, player) {
						if ( ! player) {
							user.ready = false;
						}
						user.status = 'active';
						user.socket_id = client.id;
						Players.update({ _id: client.user_id }, { $set: user }, { upsert: true }, sendPlayers);
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

		client.on('user.ready', function(ready) {
			Players.update({ _id: client.user_id }, { $set: { ready: ready } }, sendPlayers);
		});

		client.on('user.rating', function(data) {
			var rating = { user_id: client.user_id, ratings: data };
			Ratings.update({ user_id: client.user_id }, rating, { upsert: true });
		});

		client.on('ratings.get', function() {
			sendRatings();
		});

		client.on('round.next', function() {
			// Players.update({}, { $set: { ready: false } }, { multi: true }, function() {
			// 	sendUsers();
			// });
		});

		client.on('user.remove', function(user_id) {
			if (user_id && client.role == 'host') {
				Players.findOne({ _id: user_id }, function(err, player) {
					// io.sockets.socket(player.socket_id).emit('leave');
					Players.remove({ _id: user_id }, sendPlayers);
				});

			}
		});

		client.on('disconnect', function() {
			if (client.role == 'player') {
				Players.update({ _id: client.user_id }, { $set: { status: 'disconnected' } }, sendPlayers);
			}
		});

	});
}

module.exports = SocketController;