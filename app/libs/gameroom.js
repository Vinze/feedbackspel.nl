var _ = require('underscore');

var players = [];
var state = {};

var Gameroom = function(room) {

	if ( ! state[room]) {
		state[room] = { round: 1, cards: [] };
	}
	
	this.setCards = function(cards) {
		state[room].cards = cards;
	}

	this.getCard = function() {
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
			playerData.step = 1;
			playerData.ratings = {};
			players.push(playerData);
		}
	}

	this.removePlayer = function(playerId) {
		players = _.reject(players, function(player) {
			return player._id == playerId;
		});
	}

	this.setPlayerStep = function(playerId, step) {
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
			return (player.step == 2) ? memo + 1 : memo;
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
			toPlayer.ratings[feedback.from] = {
				from: _.pick(fromPlayer, '_id', 'email', 'firstname', 'lastname'),
				rating: feedback.rating
			};
		}
	}

	this.getFeedback = function(playerId) {
		var player = _.find(players, function(player) {
			return player._id == playerId;
		});
		if (player && player.ratings) {
			return _.map(player.ratings, function(rating) {
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
			_.each(player.ratings, function(ratings) {
				if (summary[player._id]) {
					summary[player._id].rating += ratings.rating;
				} else {
					summary[player._id] = {
						_id: player._id,
						firstname: player.firstname,
						lastname: player.lastname,
						rating: ratings.rating
					};
				}
			});
		});

		return _.sortBy(summary, function(result) {
			return result.rating;
		}).reverse();
	}

	this.nextRound = function() {
		var players = this.getPlayers();

		_.each(players, function(player) {
			player.ratings = {};
			player.step = 1;
		});

		state[room].round++;
	}

	this.getRound = function() {
		return state[room].round;
	}

	this.getState = function() {
		return {
			round: this.getRound(),
			card: this.getCard(),
			players: this.getPlayers(),
			playersReady: this.getPlayersReady(),
			summary: this.getSummary()
		};
	}

	this.resetState = function() {
		var players = this.getPlayers();

		_.each(players, function(player) {
			player.ratings = {};
			player.step = 1;
		});

		state[room].round = 1;
	}

	return this;
}

module.exports = Gameroom;