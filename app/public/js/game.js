var players = [
	{ 'id': 1, 'firstname': 'George', 'lastname': 'Clooney' },
	{ 'id': 2, 'firstname': 'Emma', 'lastname': 'Watson' },
	{ 'id': 3, 'firstname': 'Morgan', 'lastname': 'Freeman' },
	{ 'id': 4, 'firstname': 'Zooey', 'lastname': 'Deschanel' },
	{ 'id': 5, 'firstname': 'Gerard', 'lastname': 'Butler' }
];

var comments = {};

var PlayerView = _.template([
	'<li class="player" id="player-<%= id %>">',
		'<img src="img/avatars/<%= id %>.jpg">',
		'<h3><%= firstname %> <%= lastname %></h3>',
		'<div class="checkbox"><i class="fa fa-check"></i></div>',
	'</li>'
].join('\n'));

var CommentView = _.template([
	'<div class="overlay">',
		'<div class="comment">',
			'<a class="close"><i class="fa fa-times"></i></a>',
			'<h2>Feedback voor <%=firstname%>:</h2>',
			'<textarea><%=comment%></textarea>',
			'<div class="card-actions">',
				'<button class="cancel"><i class="fa fa-times"></i></button>',
				'<button class="save"><i class="fa fa-check"></i></button>',
			'</div>',
		'</div>',
	'</div>'
].join('\n'));

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
		_.each(players, function(player) {
			Game.addPlayer(player);
		});
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
			$comment.fadeOut(200, function() {
				$comment.remove();
			});
		}
		
		// Get the modal html and fade it in
		var $comment = $(CommentView({
			comment: Game.getComment(player.id),
			firstname: player.firstname
		}));
		var $textarea = $comment.find('textarea');

		// Append the modal to the body
		$('body').append($comment);

		// Fade the modal in
		$comment.fadeIn(200);

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
		//$overlay.on('click', function() {
		//	self.exit();
		//});

		// Prevent closing the model when clicking inside the comment box
		//$overlay.on('click', '.comment', function(e) {
		//	e.stopPropagation();
		//});
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
			setTimeout(function() {
				Game.render();
			}, 5000);
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