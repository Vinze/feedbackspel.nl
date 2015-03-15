var _ = require('underscore');

var players = [];
var state = {};

var Gameroom = function(room) {

	if ( ! room) throw new Error('No room has been specific!');

	if (state[room]) {
		// If the room already exists, set the timestamp when it was last updated
		state[room].modified = Math.floor(Date.now() / 1000);
	} else {
		// The gameroom doesn't exist yet, create a new one
		state[room] = { round: 1, cards: [], modified: Math.floor(Date.now() / 1000) };
	}
	
	this.setCards = function(cards) {
		// Set the feedback cards
		state[room].cards = cards;
	}

	this.getCard = function() {
		// Return the card
		if (state[room] && state[room].cards.length > 0) {
			return state[room].cards[state[room].round - 1] || null;
		} else {
			return null;
		}
	}

	this.getCards = function() {
		return state[room].cards;
	}

	this.setPlayer = function(playerData) {
		var player = _.find(players, function(player) {
			return player._id == playerData._id;
		});
		if (player) {
			_.extend(player, playerData);
		} else {
			playerData.step = 'setRating';
			playerData.results = {};
			players.push(playerData);
		}
	}

	this.removePlayer = function(playerId) {
		players = _.reject(players, function(player) {
			return player._id == playerId;
		});
	}

	this.setPlayerStep = function(playerId, step) {
		// setRating - feedbackSend - showResults - gameFinished
		var player = _.find(players, function(player) {
			return player._id == playerId;
		});
		if (player) {
			player.step = step;
		}
	}
	
	this.getPlayersReady = function() {
		var players = this.getPlayers();

		return _.reduce(players, function(memo, player) {
			return (player.step == 'feedbackSend') ? memo + 1 : memo;
		}, 0);
	}

	this.getPlayers = function() {
		var playersInRoom = _.filter(players, function(player) {
			return player.room == room;
		});
		return _.sortBy(playersInRoom, function(player) {
			return player.firstname;
		});
	}

	this.getPlayer = function(playerId) {
		return _.find(players, function(player) {
			return player._id == playerId;
		});
	}

	this.setFeedback = function(feedback) {
		var toPlayer = _.find(players, function(player) {
			return player._id == feedback.to;
		});
		var fromPlayer = _.find(players, function(player) {
			return player._id == feedback.from;
		});
		if (toPlayer && fromPlayer) {
			toPlayer.results[feedback.from] = {
				from: _.pick(fromPlayer, '_id', 'email', 'firstname', 'lastname'),
				rating: feedback.rating
			};
		}
	}

	this.getFeedback = function(playerId) {
		var player = _.find(players, function(player) {
			return player._id == playerId;
		});
		if (player && player.results) {
			return _.map(player.results, function(rating) {
				return rating;
			});
		} else {
			return [];
		}
	}

	this.getSummary = function() {
		var summary = {};
		var players = this.getPlayers();

		_.each(players, function(player) {

			var sum = _.reduce(player.results, function(memo, results) {
				return memo + results.rating;
			}, 0)
			
			summary[player._id] = {
				_id: player._id,
				firstname: player.firstname,
				lastname: player.lastname,
				rating: Math.round(sum / ((players.length - 1) * 5) * 5)
			};
		});

		return _.sortBy(summary, function(result) {
			return result.rating;
		}).reverse();
	}

	this.nextRound = function() {
		var players = this.getPlayers();

		_.each(players, function(player) {
			player.results = {};
			player.step = 'setRating';
		});

		state[room].round++;
	}

	this.getRound = function() {
		return state[room].round;
	}

	this.getModified = function() {
		return state[room].modified;
	}

	this.getState = function() {
		return {
			round: this.getRound(),
			card: this.getCard(),
			players: this.getPlayers(),
			playersReady: this.getPlayersReady(),
			summary: this.getSummary(),
			modified: this.getModified()
		};
	}

	this.reset = function() {
		var players = this.getPlayers();
		_.each(players, function(player) {
			player.results = {};
			player.step = 'setRating';
		});
		state[room].round = 1;
	}

	this.remove = function() {
		players = _.reject(players, function(player) {
			return player.room == room;
		});

		delete state[room];
	}

	return this;
}

module.exports = Gameroom;