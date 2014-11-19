var socketio  = require('socket.io');
var jwt       = require('jwt-simple');
var Datastore = require('nedb');
var _         = require('underscore');
var moment    = require('moment');
var async     = require('async');
var db        = require('../libs/datastore');
var config    = require('../libs/config');

/*
Game status:
1 = Show card, user fills in feedback
2 = All users ready
3 = Show results

Player step:
1 = Insert feedback
2 = Feedback read

Gamestate = {
	game_id: 1,
	round: 1,
	card: 'Betrouwbaar'
	players: [
		{
			id: 1,
			name: 'Vincent Bremer',
			step 2,
			ratings: [
				{ id: 2, name: 'Koop Otten', rating: 5 },
				{ id: 3, name: 'Tjerk Dijkstra', rating: 3 }
			]
		},
		{
			id: 2,
			name: 'Koop Otten',
			step 2,
			ratings: [
				{ id: 1, name: 'Vincent Bremer', rating: 3 },
				{ id: 3, name: 'Tjerk Dijkstra', rating: 4 }
			]
		}
	]
}
*/

//================================================================
// Testing testing testing testing testing testing testing testing
//================================================================

var Room = function(room_id) {

	var room_id = room_id;
	var step = 1;
	var round = 1;
	var players = [];

	this.setPlayer = function(user) {
		players.push(user);
	};

	this.setFeedback = function(user, rating) {
		var player = _.find(players, function(item) {
			return item.id == user.to.id;
		});
		player.ratings[user.from.id] = { from: user.from, rating: rating };
	};

	this.resetFeedback = function(user, rating) {
		_.each(players, function(player) {
			player.ratings = {};
		});
	};

	this.getState = function() {
		return players;
	};
}

var gamestate = new Room(1);

var user1 = { id: 1, name: 'Vincent', ratings: {} };
var user2 = { id: 2, name: 'Henk', ratings: {} };
var user3 = { id: 3, name: 'Jantje', ratings: {} };

gamestate.setPlayer(user1);
gamestate.setPlayer(user2);
gamestate.setPlayer(user3);

gamestate.setFeedback({ from: user2, to: user1 }, 5);
gamestate.setFeedback({ from: user3, to: user1 }, 3);


// gamestate.resetFeedback();

var testdata = gamestate.getState();

console.log(testdata);

// var Gamestate = new Datastore();

// Gamestate.insert({
// 	room: 1,
// 	card: 'Betrouwbaar',
// 	step: 1,
// 	players: []
// });

// async.series([
// 	function(callback) {
// 		console.log(':: Adding users')

// 		Gamestate.update({ room: 1 }, {
// 			$push: { players: { name: 'Vincent', ratings: [] } } 
// 		}, callback);
// 	},
// 	function(callback) {
// 		Gamestate.update({ room: 1 }, {
// 			$push: { players: { name: 'Henk', ratings: [] } } 
// 		}, callback);
// 	},
// 	function(callback) {
// 		Gamestate.update({ room: 1 }, {
// 			$push: { players: { name: 'Fsdas', ratings: [] } } 
// 		}, callback);
// 	},
// 	function(callback) {
// 		console.log(':: Remove a user')
		
// 		Gamestate.update({ room: 1 }, {
// 			$pull: { players: { name: 'Fsdas' } }
// 		}, callback);
// 	},
// 	function(callback) {
// 		console.log(':: Adding some feedback')

// 		callback();

// 		Gamestate.players.push({ 'dsa': 'dsa' })

// 		// Gamestate.update({ room: 1 }, {

// 		// }, callback);
// 	},
// ], function() {
// 	Gamestate.findOne	({ room: 1 }, function(err, doc) {
// 		console.log(doc);
// 	});
// });


//================================================================
// Testing testing testing testing testing testing testing testing
//================================================================


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