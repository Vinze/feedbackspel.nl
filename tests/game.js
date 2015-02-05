var expect = require('expect.js');

var Gameroom = require('../app/libs/gameroom.js');

var player1 = { _id: 1, firstname: 'Vincent', lastname: '', role: 'player', room: 10 };
var player2 = { _id: 2, firstname: 'Henk', lastname: '', role: 'player', room: 10 };
var player3 = { _id: 3, firstname: 'Jantje', lastname: '', role: 'player', room: 10 };
var player4 = { _id: 4, firstname: 'Nienke', lastname: '', role: 'player', room: 5 };

describe('When playing the game', function() {

	it('gameroom.js should export a function', function() {
		expect(Gameroom).to.be.a('function');
	});

	it('should be able to set and get the cards', function() {
		Gameroom(10).setCards(['Betrouwbaar', 'Geduldig', 'Roekeloos']);
		Gameroom(5).setCards(['Zelfverzekerd']);
	});

	it('should retrieve the cards', function() {
		var cardsRoom10 = Gameroom(10).getCards();
		var cardsRoom5 = Gameroom(5).getCards();

		expect(cardsRoom10.length).to.be(3);
		expect(cardsRoom5.length).to.be(1);
	});

	it('should insert some players', function() {
		Gameroom(10).setPlayer(player1);
		Gameroom(10).setPlayer(player2);
		Gameroom(10).setPlayer(player3);
		Gameroom(10).setPlayer(player4);
	});

	it('should retrieve all players', function() {
		var players = Gameroom(10).getPlayers();
		expect(players.length).to.be(3);

		var players = Gameroom(5).getPlayers();
		expect(players.length).to.be(1);
	});

	it('should retrieve a single player by id', function() {
		var player = Gameroom(10).getPlayer(1);
		expect(player).to.be.object;
	});

	it('should remove a user', function() {
		Gameroom(10).removePlayer(2);

		var players = Gameroom(10).getPlayers();
		var player = Gameroom(10).getPlayer(2);

		expect(players.length).to.be(2);
		expect(typeof player).to.be('undefined');

		Gameroom(10).setPlayer(player2);
	});

	it('should only return players in a specific room', function() {
		var playersRoom10 = Gameroom(10).getPlayers();
		expect(playersRoom10.length).to.be(3);

		Gameroom(10).setPlayer({ _id: 3, room : 5 });

		var playersRoom5 = Gameroom(5).getPlayers();
		expect(playersRoom5.length).to.be(2);

		Gameroom(10).setPlayer({ _id: 3, room : 10 });
	});

	it('should be able to set some feedback', function() {
		// Insert the feedback
		Gameroom(10).setFeedback({ from: 1, to: 2, rating: 5 }); // (from user 1 to user 2 with a rating of 5)
		Gameroom(10).setFeedback({ from: 1, to: 3, rating: 4 }); // (from user 1 to user 3 with a rating of 2)
		Gameroom(10).setFeedback({ from: 2, to: 3, rating: 4 }); // (from user 2 to user 3 with a rating of 3)

		// Set the users to step 2 (= ready)
		Gameroom(10).setPlayerStep(1, 2);
		Gameroom(10).setPlayerStep(2, 2);

		expect(Gameroom(10).getPlayersReady()).to.be(2); // 2 users should be at step 2 (= ready)
	});

	it('should be able to get the feedback', function() {
		var feedbackPlayer1 = Gameroom(10).getFeedback(1); // Get feedback of user 1
		var feedbackPlayer2 = Gameroom(10).getFeedback(2); // Get feedback of user 2
		var feedbackPlayer3 = Gameroom(10).getFeedback(3); // Get feedback of user 3

		expect(feedbackPlayer1.length).to.be(0); // User 1 hasn't received any feedback
		expect(feedbackPlayer2.length).to.be(1); // User 2 has received feedback from 1 user
		expect(feedbackPlayer3.length).to.be(2); // User 3 has received feedback from 2 users

		expect(feedbackPlayer2[0].from).to.eql({ _id: 1, firstname: 'Vincent', lastname: '' });
	});

	it('should be able to get the results of a game', function() {
		var summary = Gameroom(10).getSummary();
		expect(summary.length).to.be(3);
		expect(summary[0]).to.eql({ _id: 3, firstname: 'Jantje', lastname: '', rating: 4 });
		expect(summary[1]).to.eql({ _id: 2, firstname: 'Henk', lastname: '', rating: 3 });
		expect(summary[2]).to.eql({ _id: 1, firstname: 'Vincent', lastname: '', rating: 0 });
	});

	it('should get the gamestate', function() {
		var gameState = Gameroom(10).getState();

		expect(gameState.round).to.be(1);
		expect(gameState.card).to.be('Betrouwbaar');
		expect(gameState.players.length).to.be(3);
	});

	it('should go to the next round', function() {
		Gameroom(10).nextRound();

		var gamestate = Gameroom(10).getState();

		expect(gamestate.round).to.be(2);
		expect(gamestate.card).to.be('Geduldig');

		for (var i = 0; i < gamestate.players.length; i++) {
			expect(gamestate.summary[i].rating).to.be(0);
		}
	});

	it('should be able to reset a game', function() {
		Gameroom(10).reset();

		var gamestate = Gameroom(10).getState();

		expect(gamestate.round).to.be(1);
		expect(gamestate.card).to.be('Betrouwbaar');
		expect(gamestate.playersReady).to.be(0);

		for (var i = 0; i < gamestate.players.length; i++) {
			expect(gamestate.summary[i].rating).to.be(0);
		}
	});

	it('should be possible to remove a complete game', function() {
		Gameroom(10).remove();
	});

});

describe('API calls', function() {
});