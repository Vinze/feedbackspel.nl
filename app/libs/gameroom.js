var _ = require('underscore');

var Gameroom = function() {

	var step    = 1;
	var round   = 1;
	var card    = null;
	var players = [];
	var cards   = [];

	this.setCards = function(customCards) {
		cards = customCards;
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
		return _.reduce(players, function(memo, player) {
			return (player.step == 2) ? memo + 1 : memo;
		}, 0);
	}

	this.getPlayers = function() {
		return players;
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
				from: _.pick(fromPlayer, 'email', 'firstname', 'lastname'),
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
		_.each(players, function(player) {
			player.ratings = {};
			player.step = 1;
		});
		round++;
	}

	this.getRound = function() {
		return round;
	}

	this.getCard = function() {
		return cards[round];
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

}

module.exports = Gameroom;