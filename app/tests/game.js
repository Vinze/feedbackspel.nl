var assert = require('assert')
var expect = require('expect.js');

var Room = require('../libs/gameroom.js')

var Game = new Room()

var user1 = { id: 1, name: 'Vincent' }
var user2 = { id: 2, name: 'Henk' }
var user3 = { id: 3, name: 'Jantje' }

describe('managing users', function() {

	it('should be able to insert some users', function() {
		Game.setPlayer(user1)
		Game.setPlayer(user2)
		Game.setPlayer(user3)
	})

	it('retrieves all players', function() {
		var players = Game.getPlayers()
		expect(players.length).to.be(3)
	})

	it('retrieves a single player', function() {
		var player = Game.getPlayer(1)
		expect(player).to.be.object
	})

	it('should be able to remove a user', function() {
		Game.removePlayer(2)

		var players = Game.getPlayers()
		var player = Game.getPlayer(2)

		expect(players.length).to.be(2)
		expect(player).to.be.undefined
	})

})

describe('managing ratings', function() {

	it('should be able to set some ratings', function() {
	})
})

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



// Setup some testdata
// var user1 = { id: 1, name: 'Vincent' }
// var user2 = { id: 2, name: 'Henk' }
// var user3 = { id: 3, name: 'Jantje' }

// // Insert some players
// Game.setPlayer(user1)
// Game.setPlayer(user2)
// Game.setPlayer(user3)

// // Alter an user
// user3.name = 'John';
// Game.setPlayer(user3)

// // User 1 sets feedback
// Game.setFeedback(user1, 2, 5)
// Game.setFeedback(user1, 3, 3)
// Game.setPlayerStep(1, 2)

// // User 2 sets feedback
// Game.setFeedback(user2, 1, 2)
// Game.setFeedback(user2, 3, 5)
// Game.setPlayerStep(2, 2)

// // User 3 sets feedback
// Game.setFeedback(user3, 1, 3)
// Game.setFeedback(user3, 2, 3)
// Game.setPlayerStep(3, 2)

// // Get the players and results of round 1
// console.log('Players round 1:')
// console.log(Game.getPlayers())
// console.log('Results round 1:')
// console.log(Game.getResults())

// // Go to the next round
// Game.nextRound()

// // Get the players and results of round 2
// console.log('Players round 2:')
// console.log(Game.getPlayers())
// console.log('Results round 2:')
// console.log(Game.getResults())
