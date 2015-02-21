var token  = Cookies.get('fbs_token');
var url    = 'http://' + window.location.hostname + ':1337';
var room   = _.last(window.location.href.split('/'));
var socket = io(url, { query: 'token=' + token + '&role=host&room=' + room });

function replaceTags(content, tags) {
	return content.replace(/\[(.*?)\]/gi, function(match, text) {
		if (tags[text]) {
			return tags[text];
		} else {
			return match;
		}
	});
}

var Game = new Ractive({
	el: 'game',
	template: '#game-tpl',
	data: {
		step: null,
		card: null,
		fullscreen: false,
		showHelp: true,
		players: [],
		summary: {},
		room: room,
		baseURL: baseURL,
		question: function() {
			var summary = Game.get('summary');
			var card = Game.get('card').toLowerCase();
			return questionary(summary, card);
		}
	}
});

Game.on({
	nextRound: function(evt) {
		socket.emit('round.next');
		evt.original.preventDefault();
	},
	toggleHelp: function() {
		Game.toggle('showHelp');
	},
	enterFullscreen: function() {
		Game.set('fullscreen', true);
		enterFullscreen();
	},
	exitFullscreen: function() {
		Game.set('fullscreen', false);
		exitFullscreen();
	},
	removePlayer: function(evt, player) {
		swal({
			title: 'Deelnemer verwijderen',
			text: 'Weet je zeker dat je ' + player.firstname + ' wilt verwijderen uit het spel?',
			showCancelButton: true,
			cancelButtonText: 'Nee',
			confirmButtonColor: '#DD5755',
			confirmButtonText: 'Ja',
			closeOnConfirm: true,
			allowOutsideClick: true
		}, function() {
			socket.emit('player.leave', player._id);
		});
		
		evt.original.preventDefault();
	},
	restartGame: function(evt) {
		var restart = confirm('Spel herstarten?');
		if (restart) {
			socket.emit('game.restart');
		}
		evt.original.preventDefault();
	},
	removeGame: function(evt) {
		swal({
			title: "Spel beëindigen?",
			text: "Weet je zeker dat je wilt stoppen met het spel?",
			showCancelButton: true,
			cancelButtonText: "Nee",
			confirmButtonColor: "#DD5755",
			confirmButtonText: "Ja",
			closeOnConfirm: false,
			allowOutsideClick: true
		}, function() {
			socket.emit('game.remove');
		});
	}
});

socket.on('round.next', function(state) {
	Game.set('players', state.players);
	Game.set('step', null).then(function() {
		if (state.card) {
			Game.set('card', state.card);
			Game.set('summary', {});
			Game.set('step', 'showCard');
		} else {
			Game.set('step', 'gameFinished');
		}
	});
});

socket.on('gamestate', function(state) {
	Game.set('players', state.players);
	Game.set('card', state.card);

	if (state.players.length >= 1 && state.players.length == state.playersReady) {
		Game.set('summary', state.summary);
		if (state.card) {
			Game.set('step', null).then(function() {
				Game.set('step', 'showResults');
			});
		} else {
			Game.set('step', 'gameFinished');
		}
	} else if (Game.get('step') != 'showCard') {
		Game.set('step', 'showCard');
	}
});

socket.on('game.leave', function() {
	window.location.replace('/dashboard');
});