var token  = Cookies.get('fbs_token');
var room   = _.last(window.location.href.split('/'));
var socket = io(baseURL, { query: 'token=' + token + '&role=host&room=' + room });

function getQuestion(summary, card) {

	var data = {};

	var highResults = _.filter(summary, function(s) {
		return s.rating > 3;
	});

	var lowResults = _.filter(summary, function(s) {
		return s.rating < 3;
	});

	data.card = card.toLowerCase();

	data.random = summary[_.random(0, summary.length - 1)];

	data.highest = _.max(summary, function(s) {
		return s.rating;
	});

	data.lowest = _.min(summary, function(s) {
		return s.rating;
	});

	data.randomHigh = highResults[_.random(0, highResults.length - 1)];

	data.randomLow = lowResults[_.random(0, lowResults.length - 1)];

	data.diffHighLow = data.highest.rating - data.lowest.rating;

	var questions = [
		function() { // #0
			if (data.random.rating == 1) {
				return Mustache.render('{{random.firstname}}, je kreeg 1 ster voor de eigenschap {{card}}, ben je het hiermee eens?', data);
			} else {
				return Mustache.render('{{random.firstname}}, je kreeg {{random.rating}} sterren voor de eigenschap {{card}}, ben je het hiermee eens?', data);
			}
		},
		function() { // #1
			if (data.random.rating == 1) {
				return Mustache.render('Waarom verdiend {{random.firstname}} maar 1 ster voor de eigenschap {{card}}?', data);
			} else {
				return Mustache.render('Waarom verdiend {{random.firstname}} {{random.rating}} sterren voor de eigenschap {{card}}?', data);
			}
		},
		function() { // #2
			if (data.diffHighLow >= 3) {
				return Mustache.render('{{highest.firstname}} kreeg {{diffHighLow}} sterren meer dan {{lowest.firstname}}, waarom past de eigenschap {{card}} zoveel beter bij {{highest.firstname}}?', data);
			}
		},
		function() { // #3
			if (data.lowest.rating == 1) {
				return Mustache.render('{{lowest.firstname}} kreeg slechts 1 ster voor de eigenschap {{card}}, waarom past deze eigenschap niet bij {{lowest.firstname}}?', data);
			}
		},
		function() { // #4
			if (data.lowest.rating == 2) {
				return Mustache.render('{{lowest.firstname}} kreeg slechts 2 sterren voor de eigenschap {{card}}, waarom zo weinig?', data);
			}
		},
		function() { // #5
			if (data.randomHigh) {
				return Mustache.render('Waarom is {{randomHigh.firstname}} {{card}}?', data);
			}
		},
		function() { // #6
			if (data.randomHigh) {
				return Mustache.render('Wat maakt {{randomHigh.firstname}} {{card}}?', data);
			}
		},
		function() { // #7
			if (data.randomHigh) {
				return Mustache.render('{{randomHigh.firstname}} kreeg {{randomHigh.rating}} sterren voor de eigenschap {{card}}, waaruit blijkt dat deze eigenschap goed bij {{randomHigh.firstname}} past?', data);
			}
		}
	];

	var randomNumber = _.random(0, questions.length - 1);

	return questions[randomNumber]() || getQuestion(summary, card);
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
		question: null
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
		swal({
			title: 'Spel herstarten',
			text: 'Weet je zeker dat je het spel wilt herstarten?',
			showCancelButton: true,
			cancelButtonText: 'Nee',
			confirmButtonColor: '#DD5755',
			confirmButtonText: 'Ja',
			closeOnConfirm: true,
			allowOutsideClick: true
		}, function() {
			socket.emit('game.restart');
		});
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

	if (state.players.length > 0 && state.players.length == state.playersReady) {
		Game.set('summary', state.summary);
		if (state.card) {
			if (Game.get('step') == 'showResults') return;

			Game.set('step', null).then(function() {
				Game.set('showHelp', false);
				Game.set('step', 'showResults');

				Game.set('question', getQuestion(state.summary, state.card));
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