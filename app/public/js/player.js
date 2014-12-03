var userId = null;
var token  = Cookies.get('fbs_token');
var url    = 'http://' + window.location.hostname + ':1337';

function verifyConnection(callback) {
	var socket;
	if (socket && socket.connected) {
		callback(socket);
	} else {
		socket = io(url, { query: 'token=' + token + '&role=player' });
		callback(socket);
	}
}

var Player = new Ractive({
	el: 'content',
	template: '#template',
	data: {
		step: null, // 1 = set feedback // 2 = waiting // 3 = show results
		card: '',
		players: [],
		playersReady: 0,
		userId: null,
		rating: {},
		results: {}
	}
});

Player.on({
	ready: function(evt) {
		var rating = Player.get('rating');
		verifyConnection(function(socket) {
			socket.emit('player.ready', rating);
		});
		evt.original.preventDefault();
	},
	setRating: function(evt, rating) {
		verifyConnection(function(socket) {
			Player.set('rating.' + evt.context._id, rating);
		});
		evt.original.preventDefault();
	},
	leave: function(evt) {
		verifyConnection(function(socket) {
			socket.emit('player.remove');
			window.location = '/dashboard';
		});
		evt.original.preventDefault();
	}
});

verifyConnection(function(socket) {

	socket.on('userId', function(id) {
		userId = id;
		Player.set('userId', userId);
	});

	socket.on('round.next', function(state) {
		console.log('next round!!');
		Player.set('step', 1);
		Player.set('rating', {});
		Player.set('players', state.players);
		Player.set('card', state.card);
	});

	socket.on('gamestate', function(state) {
		Player.set('players', state.players);
		Player.set('card', state.card);
		Player.set('playersReady', state.playersReady);

		var currentPlayer = _.find(state.players, function(player) {
			return player._id == userId;
		});

		var step = currentPlayer ? currentPlayer.step : 1;

		if (state.players.length >= 1 && state.players.length == state.playersReady) {
			Player.set('step', 3);
			Player.set('results', currentPlayer.ratings);
		} else {
			Player.set('step', step);
		}
	});
});