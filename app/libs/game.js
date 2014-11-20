var _ = require('underscore')

var Room = function() {

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

	this.removePlayer = function(userId) {
		players = _.reject(players, function(player) {
			return player.id == userId
		})
	}

	this.setPlayerStep = function(userId, step) {
		var player = _.find(players, function(player) {
			return player.id == userId
		})
		if (player) {
			player.step = step
		}
	}

	this.setFeedback = function(fromUser, toUserId, rating) {
		var player = _.find(players, function(player) {
			return player.id == toUserId
		})
		if (player) {
			player.ratings[fromUser.id] = { from: fromUser.name, rating: rating }
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
		var total = _.reduce(players, function(memo, p) {
			return (p.step == 2) ? memo + 1 : memo
		}, 0)
		return total
	}

	this.getPlayers = function() {
		return players
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

		results = _.sortBy(results, function(result) {
			return result.rating
		}).reverse()

		return results
	}
}

module.exports = Room;