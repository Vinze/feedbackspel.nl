var socketio  = require('socket.io');
var jwt       = require('jwt-simple');
var Datastore = require('nedb');
var _         = require('underscore');
var moment    = require('moment');
var db        = require('../libs/datastore');
var config    = require('../libs/config');

/*

Players = [
	{
	_id:       "pbZd5ZmVyUHeEiC3"
	email:     "john@doe.com"
	firstname: "John"
	lastname:  "Doe"
	socket_id: "BFoJ7pALKkaZdQzTAAAH"
	status:    "active"
	step:      1
	ratings: [
		{
			_id:       "pbZd5ZmVyUHeEiC3"
			firstname: "John"
			lastname:  "Doe"
			rating:    4
		}
		{
			_id:       "pbZd5ZmVyUHeEiC3"
			firstname: "John"
			lastname:  "Doe"
			rating:    4
		}
	]
	}
];

*/

var Players = new Datastore();
var Ratings = new Datastore();

var cards = ['Betrouwbaar', 'Geduldig', 'Roekeloos'];
var round = 0;

var SocketController = function(server) {
	var io = socketio.listen(server, { log: false });

	function sendPlayers() {
		Players.find({}).sort({ firstname: 1 }).exec(function(err, users) {
			var ready = _.reduce(users, function(memo, user) {
				return user.step == 2 ? memo + 1 : memo;
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

	function sendStatus(socket, status) {
		socket.emit('status', status);
	}

	
	function newUser(socket) {
		Players.findOne({ _id: socket.user_id }, function(err, player) {
			if ( ! player) {
				user.step = 1;
			}
			user.status = 'active';
			user.socket_id = socket.id;
			Players.update({ _id: socket.user_id }, { $set: user }, { upsert: true }, sendPlayers);
			sendStatus(socket, user.ready);
		});
	}

	io.on('connection', function(socket) {
		var token = socket.handshake.query.token;
		socket.role = socket.handshake.query.role; // host or player

		try {
			var data = jwt.decode(token, config.jwt_secret);

			db.users.findById(data.user_id, function(err, user) {
				socket.user_id = user._id;
				if (socket.role == 'player') {
					newUser(socket, user);
				} else {
					sendPlayers();
					// sendCard();
				}
			});
		} catch(err) {
			console.log(err);
		}

		socket.on('user.ready', function(ready) {
			Players.update({ _id: socket.user_id }, { $set: { step: 2 } }, sendPlayers);
		});

		socket.on('user.rating', function(data) {
			var rating = { user_id: socket.user_id, ratings: data };
			Ratings.update({ user_id: socket.user_id }, rating, { upsert: true });
		});

		socket.on('ratings.get', function() {
			sendRatings();
		});

		socket.on('round.next', function() {
			// Players.update({}, { $set: { ready: false } }, { multi: true }, function() {
			// 	sendUsers();
			// });
		});

		socket.on('user.remove', function(user_id) {
			if (user_id && socket.role == 'host') {
				Players.findOne({ _id: user_id }, function(err, player) {
					// io.sockets.socket(player.socket_id).emit('leave');
					Players.remove({ _id: user_id }, sendPlayers);
				});

			}
		});

		socket.on('disconnect', function() {
			if (socket.role == 'player') {
				Players.update({ _id: socket.user_id }, { $set: { status: 'disconnected' } }, sendPlayers);
			}
		});

	});
}

module.exports = SocketController;