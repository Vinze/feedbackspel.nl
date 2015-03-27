;(function() {

	var userId = null;
	var token  = Cookies.get('fbs_token');
	var room   = _.last(window.location.href.split('/'));
	var notification = new Audio('/pop.mp3');

	function verifyConnection(callback) {
		var socket;
		if (socket && socket.connected) {
			callback(socket);
		} else {
			socket = io(baseURL, { query: 'token=' + token + '&role=player&room=' + room });
			callback(socket);
		}
	}

	var Game = new Ractive({
		el: 'content',
		template: '#template',
		data: {
			step: null, // setRating - feedbackSend - showResults - gameFinished
			card: '',
			showHelp: true,
			opponents: [],
			playersReady: 0,
			ratings: {},
			stars: { available: 0, total: 0 },
			results: {}
		}
	});

	Game.on({
		setRating: function(evt, user) {
			var rating = parseInt(evt.node.value);
			verifyConnection(function(socket) {
				Game.set('ratings.' + user._id, rating);
			});
		},
		changeRating: function(evt) {
			verifyConnection(function(socket) {
				socket.emit('player.notready');
			});
			evt.original.preventDefault();
		},
		ready: function(evt) {
			var ratings = Game.get('ratings');
			verifyConnection(function(socket) {
				socket.emit('player.ready', ratings);
			});
			evt.original.preventDefault();
		},
		toggleHelp: function() {
			Game.toggle('showHelp');
		},
		reload: function(evt) {
			window.location.reload();
			evt.original.preventDefault();
		},
		leave: function(evt) {
			verifyConnection(function(socket) {
				swal({
					title: "Spel verlaten",
					text: "Weet je zeker dat je het spel wilt verlaten?",
					showCancelButton: true,
					cancelButtonText: "Nee",
					confirmButtonColor: "#DD5755",
					confirmButtonText: "Ja",
					closeOnConfirm: false,
				}, function() {
					socket.emit('player.leave', userId);
				});
			});
			evt.original.preventDefault();
		}
	});

	verifyConnection(function(socket) {

		socket.on('userId', function(id) {
			userId = id;
			Game.set('userId', userId);
		});

		socket.on('round.next', function(state) {
			var opponents = _.filter(state.players, function(player) {
				return player._id != userId;
			});

			var ratings = {};
			_.each(opponents, function(opponent) {
				ratings[opponent._id] = 1;
			});

			notification.play();

			Game.set({
				step: 'setRating',
				ratings: ratings,
				opponents: opponents,
				card: state.card
			});
		});

		socket.on('gamestate', function(state) {
			var opponents = _.filter(state.players, function(player) {
				return player._id != userId;
			});

			if (Game.get('opponents').length != opponents.length) {
				var total = (opponents.length == 1) ? 5 : (opponents.length * 3) + (Math.floor(opponents.length / 2));
				var ratings = {};

				_.each(opponents, function(player) {
					ratings[player._id] = 1;
				});

				Game.set('ratings', ratings);
				Game.set('stars', {
					'available': total - opponents.length,
					'total': total
				});
			}

			Game.set('card', state.card);
			Game.set('opponents', opponents);
			Game.set('playersReady', state.playersReady);

			var currentPlayer = _.find(state.players, function(player) {
				return player._id == userId;
			});

			var step = currentPlayer ? currentPlayer.step : 'setRating';

			if (opponents.length > 0 && (opponents.length + 1) == state.playersReady) {
				Game.set('step', 'showResults');
				Game.set('results', currentPlayer.results);
			} else {
				Game.set('step', step);
			}
		});

		socket.on('game.leave', function() {
			window.location = '/dashboard';
		});
	});

	Game.observe('ratings', function() {
		var ratings = Game.get('ratings');
		var given = _.reduce(ratings, function(memo, num) {
			return memo + num;
		}, 0);
		Game.set('stars.available', Game.get('stars.total') - given);
	});

}());