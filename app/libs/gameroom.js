var _ = require('underscore')

var Gameroom = function() {

	var cards = [
		'Betrouwbaar', 'Geduldig', 'Roekeloos',
		'Prikkelbaar', 'Doorzetter', 'Luidruchtig',
		'Sociaal', 'Nieuwsgierig', 'Snel afgeleid'
	]

	var step    = 1
	var round   = 1
	var card    = null
	var players = []

	this.setPlayer = function(props) {
		var player = _.find(players, function(player) {
			return player.id == props.id
		})
		if (player) {
			player = props
		} else {
			props.step = 1
			props.ratings = {}
			players.push(props)
		}
	}

	this.removePlayer = function(playerId) {
		players = _.reject(players, function(player) {
			return player.id == playerId
		})
	}

	this.setPlayerStep = function(playerId, step) {
		var player = _.find(players, function(player) {
			return player.id == playerId
		})
		if (player) {
			player.step = step
		}
	}

	this.setFeedback = function(fromPlayer, toPlayerId, rating) {
		var player = _.find(players, function(player) {
			return player.id == toPlayerId
		})
		if (player) {
			player.ratings[fromPlayer.id] = { from: fromPlayer.name, rating: rating }
		}
	}

	this.nextRound = function() {
		_.each(players, function(player) {
			player.ratings = {}
			player.step = 1
		})
		round++
	}

	this.getPlayersReady = function() {
		return _.reduce(players, function(memo, player) {
			return (player.step == 2) ? memo + 1 : memo
		}, 0)
	}

	this.getPlayers = function() {
		return players
	}

	this.getPlayer = function(playerId) {
		return _.find(players, function(player) {
			return player.id == playerId
		})
	}

	this.getState = function() {
		return {
			players: players,
			round: round,
			card: cards[round]
		}
	}

	this.getResults = function() {
		var results = {}

		_.each(players, function(player) {
			_.each(player.ratings, function(ratings) {
				if (results[player.id]) {
					results[player.id].rating += ratings.rating
				} else {
					results[player.id] = {
						name: player.name,
						rating: ratings.rating
					}
				}
			})
		})

		return _.sortBy(results, function(result) {
			return result.rating
		}).reverse()
	}
}

module.exports = Gameroom;