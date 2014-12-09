var assert = require('assert')
var expect = require('expect.js');

var Room = require('../libs/gameroom.js');

var cards = [
	'Betrouwbaar', 'Geduldig', 'Roekeloos'
];

var Game = new Room();

Game.setCards(cards);

var player1 = { _id: 1, firstname: 'Vincent', lastname: '', role: 'player' };
var player2 = { _id: 2, firstname: 'Henk', lastname: '', role: 'player' };
var player3 = { _id: 3, firstname: 'Jantje', lastname: '', role: 'player' };

describe('managing players', function() {

	it('should be able to insert some players', function() {
		// Insert some players
		Game.setPlayer(player1);
		Game.setPlayer(player2);
		Game.setPlayer(player3);
	})

	it('should retrieve all players', function() {
		var players = Game.getPlayers();
		expect(players.length).to.be(3);
	});

	it('should retrieve a single player by id', function() {
		var player = Game.getPlayer(1);
		expect(player).to.be.object;
	});

});

describe('managing feedback', function() {

	it('should be able to set and get feedback', function() {
		// Insert the feedback
		Game.setFeedback({ from: 1, to: 2, rating: 5 }); // (from user 1 to user 2 with a rating of 5)
		Game.setFeedback({ from: 1, to: 3, rating: 4 }); // (from user 1 to user 3 with a rating of 2)
		Game.setFeedback({ from: 2, to: 3, rating: 4 }); // (from user 2 to user 3 with a rating of 3)

		// Set the users to step 2 (= ready)
		Game.setPlayerStep(1, 2);
		Game.setPlayerStep(2, 2);

		var feedbackPlayer1 = Game.getFeedback(1); // Get feedback of user 1
		var feedbackPlayer2 = Game.getFeedback(2); // Get feedback of user 2
		var feedbackPlayer3 = Game.getFeedback(3); // Get feedback of user 3

		expect(feedbackPlayer1.length).to.be(0); // User 1 hasn't received any feedback
		expect(feedbackPlayer2.length).to.be(1); // User 2 has received feedback from 1 user
		expect(feedbackPlayer3.length).to.be(2); // User 3 has received feedback from 2 users

		expect(feedbackPlayer2[0].from).to.eql({ _id: 1, firstname: 'Vincent', lastname: '' });

		expect(Game.getPlayersReady()).to.be(2); // 2 users should be at step 2 (= ready)
	});

	it('should be able to get the results of a game', function() {
		var summary = Game.getSummary();
		expect(summary.length).to.be(2);
		expect(summary[0]).to.eql({ _id: 3, firstname: 'Jantje', lastname: '', rating: 8 });
		expect(summary[1]).to.eql({ _id: 2, firstname: 'Henk', lastname: '', rating: 5 });
	});

});

describe('managing rounds', function() {

	it('should be able to get the game state', function() {
		var gameState = Game.getState();
		expect(gameState.round).to.be(1);
		expect(gameState.card).to.be('Betrouwbaar');
		expect(gameState.players.length).to.be(3);
	});

	it('should be able to get to the next round', function() {
		Game.nextRound();
		expect(Game.getSummary().length).to.be(0);
		expect(Game.getRound()).to.be(2);
		expect(Game.getCard()).to.be('Geduldig');
	});

});

describe('removing players', function() {

	it('should be able to remove a user', function() {
		Game.removePlayer(2);

		var players = Game.getPlayers();
		var player = Game.getPlayer(2);

		expect(players.length).to.be(2);
		expect(typeof player).to.be('undefined');
	});

});

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