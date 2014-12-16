var token  = Cookies.get('fbs_token');
var url    = 'http://' + window.location.hostname + ':1337';
var room   = _.last(window.location.href.split('/'));
var socket = io(url, { query: 'token=' + token + '&role=host&room=' + room });

var Game = new Ractive({
	el: 'game',
	template: '#game-tpl',
	data: {
		step: null,
		card: null,
		fullscreen: false,
		players: [],
		results: {}
	}
});

Game.on({
	next: function(evt) {
		socket.emit('round.next');
		evt.original.preventDefault();
	},
	remove: function(evt, player) {
		console.log(player);
		socket.emit('player.remove', player._id);
		evt.original.preventDefault();
	},
	enterFullscreen: function() {
		Game.set('fullscreen', true);
		enterFullscreen();
	},
	exitFullscreen: function() {
		Game.set('fullscreen', false);
		exitFullscreen();
	},
	restart: function(evt) {
		var restart = confirm('Spel herstarten?');
		if (restart) {
			socket.emit('game.restart');
		}
		evt.original.preventDefault();
	}
});

socket.on('round.next', function(state) {
	Game.set('players', state.players);
	Game.set('step', null).then(function() {
		if (state.card) {
			Game.set('card', state.card);
			Game.set('results', []);
			Game.set('step', 1);
		} else {
			Game.set('step', 3);
		}
	});
});

socket.on('gamestate', function(state) {
	Game.set('players', state.players);
	Game.set('card', state.card);

	console.log(state);

	if (state.players.length >= 1 && state.players.length == state.playersReady) {
		Game.set('results', state.summary);
		if (state.card) {
			Game.set('step', null).then(function() {
				Game.set('step', 2);
			});
		} else {
			Game.set('step', 3);
		}
	} else if (Game.get('step') != 1) {
		Game.set('step', 1);
	}
});