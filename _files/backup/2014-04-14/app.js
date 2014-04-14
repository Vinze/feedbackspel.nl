var io = require('socket.io').listen(3000);
var mysql2 = require('mysql2');

// Connect to the MySQL database
var mysql = mysql2.createConnection({
	user: 'root',
	password: 'usbw',
	database: 'feedbackspel.nl'
});

var cards = [
	{ description: 'Zelfingenomen' },
	{ description: 'Arrogant' }
];

// Load a new IMDB (in memory database)
var Datastore = require('nedb');
var users = new Datastore();

// Configure the socket
io.configure(function() {
	// Set the authorization function
	io.set('authorization', function (data, accept) {
		// Set the mysql queries
		var select = "SELECT id, firstname, lastname, hash, room FROM users WHERE token = ? LIMIT 1";
		var update = "UPDATE users SET token = '' WHERE token = ?";

		// Get the token from the URL
		var token = data.query.token;

		// Find the user with the token
		mysql.execute(select, [token], function(err, rows) {
			// Check if the user can be found by the token
			if (rows.length == 1 && ! err) {
				// mysql.execute(update, [token]);
				users.count({ id: rows[0].id }, function(err, total) {
					if (total == 0) {
						data.user = rows[0];
						accept(null, true);
					} else {
						accept('Client already connected!', false);		
					}
				});
			} else {
				accept('No valid token provided!', false);
			}
		});
	});
	io.set('log level', 1);
});

io.sockets.on('connection', function(client) {
	// Set the user data
	var user = client.handshake.user;
	    user.socket_id = client.id;
	client.join(user.room);

	// Store the user
	users.insert(user, function() {
		// Logging
		console.log('Connected:', user.firstname + ' ' + user.lastname);

		// Find all users and send them to the connected user
		users.find({room: user.room}, function(err, results) {
			io.sockets.in(user.room).emit('users:updated', results);
		});
	});

	// A user is done
	client.on('user:done', function() {

		// Find the user
		users.findOne({ socket_id: client.id }, function(err, user) {
			// Update the user
			users.update({ socket_id: client.id }, { $set: { done: true } }, {multi: true}, function(err, rows) {
				console.log('Done:', user.firstname + ' ' + user.lastname);
				io.sockets.in(user.room).emit('user:done', user.id);
			});

			// Count the users in the room who are done
			users.count({room: user.room, done: true }, function(err, total) {
				var total_users = io.sockets.clients(user.room).length;

				// Check if all users in the room are done
				if (total == total_users) {
					users.update({done: true }, { $set: { done: false } }, {multi: true});
					console.log('Everyone is ready');
					io.sockets.in(user.room).emit('game:done', cards);
				}
			});
		});
	});
	
	// A user has disconnected
	client.on('disconnect', function() {
		users.findOne({ socket_id: client.id }, function(err, user) {
			users.remove({ socket_id: client.id }, function() {
				users.find({room: user.room}, function(err, results) {
					io.sockets.in(user.room).emit('users:updated', results);
				});
			});
			console.log('Disconnected:', user.firstname + ' ' + user.lastname);
		});
	});
});