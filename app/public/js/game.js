var players = [
	{ 'id': 1, 'firstname': 'George', 'lastname': 'Clooney' },
	{ 'id': 2, 'firstname': 'Emma', 'lastname': 'Watson' },
	{ 'id': 3, 'firstname': 'Morgan', 'lastname': 'Freeman' },
	{ 'id': 4, 'firstname': 'Zooey', 'lastname': 'Deschanel' },
	{ 'id': 5, 'firstname': 'Gerard', 'lastname': 'Butler' }
];

var comments = {};

var PlayerView = _.template($('#player-tpl').html());

var CommentView = _.template($('#comment-tpl').html());

var Game = {

	render: function() {
		$('.game-results').fadeOut(200, function() {
			$('.game-board').fadeIn(200);
		});
	},

	// Add a single player
	addPlayer: function(player) {
		var html = PlayerView(player);
		$('.player-list').append(html);
	},
	
	// Add a collection of players
	addPlayers: function(players) {
		var html = '';
		_.each(players, function(player) {
			html += PlayerView(player);
		});
		$('.player-list').html(html);
	},
	
	// Find a player by id
	findPlayer: function(player_id) {
		return _.find(players, function(player) {
			return player.id == player_id;
		});
	},
	
	// Find a comment by player id
	getComment: function(player_id) {
		return comments[player_id] ? comments[player_id] : null;
	},
	
	// Set a new comment
	setComment: function(player_id) {
		// Reference to self
		var self = this;

		// Get the selected player
		var player = Game.findPlayer(player_id);

		// Fade out and remove the comment + overlay
		self.exit = function() {
			$overlay.transition({ opacity: 0, duration: 400, complete: function() { $overlay.remove() } });
		}
		
		// Get the modal html and fade it in
		var $overlay = $(CommentView({
			comment: Game.getComment(player.id),
			firstname: player.firstname
		}));
		var $comment = $overlay.find('.comment');
		var $textarea = $comment.find('textarea');

		// Append the modal to the body
		$('body').prepend($overlay);

		// // Fade the modal in
		// $comment.fadeIn(200);
		$overlay.transition({ opacity: 1, duration: 400 });
		
		if ($textarea.val().length == 0) {
			$textarea.focus();
		}

		// Handle the save button
		$comment.on('click', '.save', function() {
			var comment = $textarea.val();
			// Check if an comment has been filled in
			if (comment.length > 2) {
				$('#player-' + player.id).addClass('selected');
				comments[player.id] = comment;
				self.exit();
			} else {
				$textarea.focus();
			}
		});
		
		// Close the modal and remove the feedback
		$comment.on('click', '.cancel', function() {
			$('#player-' + player.id).removeClass('selected');
			delete comments[player.id];
			self.exit();
		});

		// Close the modal without changing anything
		$comment.on('click', '.close', function() {
			self.exit();
		});

		// Close the modal when clicking outside the comment box
		$overlay.on('click', function() {
			self.exit();
		});

		// Prevent closing the model when clicking inside the comment box
		$comment.on('click', function(e) {
			e.stopPropagation();
		});
	},

	init: function() {
		// Add the players
		Game.addPlayers(players);

		// When clicking on a player, show the modal to set a comment
		$('.player-list').on('click', '.player', function() {
			var player_id = parseInt($(this).attr('id').split('-')[1]);
			Game.setComment(player_id);
		});
	}

}

var BLADIEBLAH = _.template('<tr><td><%= name %></td><td><%= selected %></td></tr>');

var Results = {
	
	render: function() {
		$('.game-board').fadeOut(200, function() {
			$('.game-results').fadeIn(200);
			var html = '';
			_.each(players, function(player) {
				html += BLADIEBLAH({
					name: player.firstname + ' ' + player.lastname,
					selected: Game.getComment(player.id)
				});
			});
			$('.results').html(html);

			var wait = 5;
			$('.timer').text(wait);
			var timer = setInterval(function() {
				wait--
				if (wait == 0) {
					clearInterval(timer);
					Game.render();
				} else {
					$('.timer').text(wait);
				}
			}, 1000);

		});
	},

	init: function() {
		$('.ready').on('click', function(e) {
			Results.render();
			console.log(comments);
		});
	}
}

$(function() {
	Game.init();
	Results.init();
});