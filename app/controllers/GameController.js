//================================================================
// Testing testing testing testing testing testing testing testing
//================================================================

/*
Game steps:
1 = Show card, user fills in feedback
2 = All users ready
3 = Show results

Player steps:
1 = Insert feedback
2 = Feedback ready

player = {
	id: 1,
	step: 1,
	name: 'John',
	ratings: [
		{}
	]
}

*/

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

var Game = new Room()

// Setup some testdata
var user1 = { id: 1, name: 'Vincent' }
var user2 = { id: 2, name: 'Henk' }
var user3 = { id: 3, name: 'Jantje' }

// Insert some players
Game.setPlayer(user1)
Game.setPlayer(user2)
Game.setPlayer(user3)

// Alter an user
user3.name = 'John';
Game.setPlayer(user3)

// User 1 sets feedback
Game.setFeedback(user1, 2, 5)
Game.setFeedback(user1, 3, 3)
Game.setPlayerStep(1, 2)

// User 2 sets feedback
Game.setFeedback(user2, 1, 2)
Game.setFeedback(user2, 3, 5)
Game.setPlayerStep(2, 2)

// User 3 sets feedback
Game.setFeedback(user3, 1, 3)
Game.setFeedback(user3, 2, 3)
Game.setPlayerStep(3, 2)

// Get the players and results of round 1
console.log('Players round 1:', Game.getPlayers())
console.log('Results round 1:', Game.getResults())

// Go to the next round
Game.nextRound()

// Get the players and results of round 2
console.log('Players round 2:', Game.getPlayers())
console.log('Results round 2:', Game.getResults())


//================================================================
// Testing testing testing testing testing testing testing testing
//================================================================


var GameController = {

	getHost: function(req, res) {
		res.render('game-host');
	},

	getPlay: function(req, res) {
		res.render('game-player');
	},

	getTest: function(req, res) {
		res.json(Game.getState());
	}

};

module.exports = GameController;