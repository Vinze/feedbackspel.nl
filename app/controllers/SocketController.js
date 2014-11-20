var socketio  = require('socket.io');
var jwt       = require('jwt-simple');
var Datastore = require('nedb');
var _         = require('underscore');
var moment    = require('moment');
var async     = require('async');
var db        = require('../libs/datastore');
var config    = require('../libs/config');

var Players = new Datastore();
var Ratings = new Datastore();
var cards = [
	'Betrouwbaar',
	'Geduldig',
	'Roekeloos',
	'Prikkelbaar',
	'Doorzetter',
	'Luidruchtig',
	'Sociaal',
	'Nieuwsgierig',
	'Snel afgeleid'
];
var round = 0;

var SocketController = function(server) {
	var io = socketio.listen(server, { log: false });

	function findUser(user_id, callback) {
		var fields = { _id: 1, email: 1, firstname: 1, lastname: 1, gender: 1 };
		db.users.findOne({ _id: user_id }, fields, callback);
	}

	function sendPlayers() {
		Players.find({}).sort({ firstname: 1 }).exec(function(err, users) {
			var total_ready = _.reduce(users, function(memo, user) {
				return user.step == 2 ? memo + 1 : memo;
			}, 0);
			var ready = (total_ready == users.length && users.length > 0);

			io.emit('users.updated', { users: users, ready: ready });
		});
	}

	function pickUser(users, user_id) {
		return _.find(users, function(user) {
			return user._id == user_id;
		});
	}

	function nextRound() {
		Ratings.remove({}, { multi: true });
		Players.update({}, { $set: { step: 1 } }, { multi: true }, sendPlayers);

		if (round == cards.length) {
			round = 0;
		}
		var new_card = cards[round];

		io.emit('round.next', { card: new_card, number: round });

		round++;
	}

	io.on('connection', function(socket) {

		var token = socket.handshake.query.token;
		socket.role = socket.handshake.query.role; // host or player

		try {
			var data = jwt.decode(token, config.jwt_secret);
			findUser(data.user_id, function(err, user) {
				socket.user_id = user._id;
				if (socket.role == 'player') {
					Players.findOne({ _id: socket.user_id }, function(err, player) {
						user.step = 1;
						user.status = 'active';
						user.socket_id = socket.id;
						Players.update({ _id: socket.user_id }, { $set: user }, { upsert: true }, sendPlayers);
					});
				} else {
					round = 0;
					nextRound();
					sendPlayers();
				}
			});
		} catch(err) {
			console.log(err);
		}

		socket.on('user.ready', function(ratings) {
			Ratings.remove({ 'from._id': socket.user_id }, { multi: true }, function(num_removed) {
				Players.find({}).sort({ firstname: 1 }).exec(function(err, users) {
					_.each(ratings, function(rating, user_id) {
						var to = pickUser(users, user_id);
						var from = pickUser(users, socket.user_id);
						var data = { to: to, from: from, rating: rating };
						Ratings.insert(data);
					});
					Players.update({ _id: socket.user_id }, { $set: { step: 2 } }, sendPlayers);
				});
			});

		});

		socket.on('ratings.get', function(callback) {
			Ratings.find({}, function(err, docs) {
				callback(docs);
			});
		});

		socket.on('user.remove', function(user_id) {
			if (user_id && socket.role == 'host') {
				async.parallel([
					function(callback) {
						Players.remove({ _id: user_id }, callback);
					},
					function(callback) {
						Ratings.remove({
							$or: [
								{ 'from._id': user_id },
								{ 'to._id': user_id }
							]
						}, { multi: true }, callback);
					},
				], sendPlayers );
			}
		});

		socket.on('round.next', function() {
			nextRound();
		});

		socket.on('disconnect', function() {
			if (socket.role == 'player') {
				Players.update({ _id: socket.user_id }, { $set: { status: 'disconnected' } }, sendPlayers);
			}
		});

	});
}

module.exports = SocketController;