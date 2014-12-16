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
		opponents: [],
		players: [],
		playersReady: 0,
		rating: {},
		stars: { available: 0, total: 0 },
		results: {}
	}
});

Player.on({
	setRating: function(evt, user) {
		var rating = parseInt(evt.node.value);
		verifyConnection(function(socket) {
			Player.set('rating.' + user._id, rating);
		});
	},
	changeRating: function(evt) {
		verifyConnection(function(socket) {
			socket.emit('player.notready');
		});
		evt.original.preventDefault();
	},
	ready: function(evt) {
		var rating = Player.get('rating');
		verifyConnection(function(socket) {
			socket.emit('player.ready', rating);
		});
		evt.original.preventDefault();
	},
	reload: function(evt) {
		window.location.reload();
		evt.original.preventDefault();
	},
	leave: function(evt) {
		verifyConnection(function(socket) {
			socket.emit('player.remove');
			window.location = '/start';
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
		var ratings = {};
		_.each(state.players, function(player) {
			if (userId != player._id) ratings[player._id] = 1;
		});

		Player.set('step', 1);
		Player.set('rating', ratings);
		Player.set('players', state.players);
		Player.set('card', state.card);
	});

	socket.on('gamestate', function(state) {
		var opponents = _.filter(state.players, function(player) {
			return player._id != userId;
		});

		if (Player.get('opponents').length != opponents.length) {
			var total = (opponents.length == 1) ? 5 : (opponents.length * 3) + 1;
			var ratings = {};

			_.each(opponents, function(player) {
				ratings[player._id] = 1;
			});

			Player.set('rating', ratings);
			Player.set('stars', {
				'available': total - opponents.length,
				'total': total
			});
		}

		Player.set('card', state.card);
		Player.set('opponents', opponents);
		Player.set('playersReady', state.playersReady);

		var currentPlayer = _.find(state.players, function(player) {
			return player._id == userId;
		});

		var step = currentPlayer ? currentPlayer.step : 1;

		if (opponents.length > 0 && (opponents.length + 1) == state.playersReady) {
			Player.set('step', 3);
			Player.set('results', currentPlayer.ratings);
		} else {
			Player.set('step', step);
		}
	});
});

Player.observe('rating', function() {
	var rating = Player.get('rating');
	var given = _.reduce(rating, function(memo, num) {
		return memo + num;
	}, 0);
	Player.set('stars.available', Player.get('stars.total') - given);
});