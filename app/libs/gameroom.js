var _ = require('underscore');

/*
2 players = 5 stars
3 players = 9 stars (1x5, 1x4)
4 players = 12 stars (1x5, 1x4, 1x3)
5 players = ?


*/


var Gameroom = function() {

	// var round   = 1;
	// var cards   = [];
	// var room = null;

	var players = [];
	var room = null;
	var state = {};

	this.room = function(roomId) {
		room = roomId;
		if ( ! state[room]) {
			state[room] = { round: 1, cards: [] };
		}
		return this;
	}

	this.setCards = function(cards) {
		state[room].cards = _.clone(cards);
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
		})
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

	this.getCard = function() {
		return state[room].cards[state[room].round - 1] || null;
	}

	this.getCards = function() {
		return state[room].cards;
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
		_.each(players, function(player) {
			player.ratings = {};
			player.step = 1;
		});
		state[room].round = 1;
	}

}

module.exports = Gameroom;