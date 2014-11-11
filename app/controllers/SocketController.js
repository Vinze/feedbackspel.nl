var socketio  = require('socket.io');
var jwt       = require('jwt-simple');
var Datastore = require('nedb');
var async     = require('async');
var moment    = require('moment');
var db        = require('../libs/datastore');
var config    = require('../libs/config');

var players = new Datastore();
var cards = ['Betrouwbaar', 'Geduldig', 'Roekeloos'];
var round = 0;

var SocketController = function(server) {
	var io = socketio.listen(server, { log: false });

	function sendUsers() {
		players.find({}).sort({ firstname: 1 }).exec(function(err, users) {
			io.sockets.emit('users.updated', users);
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

	function checkReady() {
		players.count({}, function(err, total) {
			players.count({ ready: true }, function(err, ready) {
				if (total == ready) {
					sendCard();
					players.update({}, { $set: { ready: false } }, { multi: true }, function() {
						sendUsers();
					});
				} else {
					sendUsers();
				}
			});
		});
	}

	io.on('connection', function(client) {
		var token = client.handshake.query.token;
		client.role = client.handshake.query.role;

		try {
			var data = jwt.decode(token, config.jwt_secret);
			db.users.findById(data.user_id, function(err, user) {
				client.user = user;
				if (client.role == 'client') {
					players.insert(user);
				}
				sendUsers();
				sendCard();
			});
		} catch(err) {
			console.log(err);
		}

		client.on('ready', function() {
			players.update({ _id: client.user._id }, { $set: { ready: true } }, checkReady);
		});

		client.on('disconnect', function() {
			if (client.role == 'client') {
				players.remove({_id: client.user._id});
				checkReady();
			}
		});

	});
}

module.exports = SocketController;