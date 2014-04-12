var io = require('socket.io').listen(3000);
var mysql2 = require('mysql2');

var mysql = mysql2.createConnection({
	user: 'root',
	password: 'usbw',
	database: 'feedbackspel.nl'
});

var Datastore = require('nedb');
var users = new Datastore();
var total_users = 0;

io.configure(function() {
	io.set('authorization', function (data, accept) {
		// Set the mysql query
		var select = "SELECT id, firstname, lastname, hash FROM users WHERE game_token = ? LIMIT 1";
		var update = "UPDATE users SET game_token = '' WHERE game_token = ?";

		// Get the token from the URL
		var token = data.query.token;

		// Find the user with the token
		mysql.execute(select, [token], function(err, rows) {
			if (rows.length == 1 && ! err) {
				mysql.execute(update, [token], function(err, rows) {
					console.log(err);
					console.log(rows);
				});
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

	// Store the user
	users.insert(user, function() {
		// Logging
		console.log('Connected:', user.firstname + ' ' + user.lastname);

		// Find all users and send them to the connected user
		users.find({}, function(err, results) {
			io.sockets.emit('users:updated', results);
		});

		// Count the total users
		total_users++;
	});

	// A user is done
	client.on('user:done', function() {
		users.findOne({ socket_id: client.id }, function(err, user) {
			users.update({ socket_id: client.id }, { $set: { done: true } }, {multi: true}, function(err, rows) {
				console.log('Done:', user.firstname + ' ' + user.lastname);
				io.sockets.emit('user:done', user.id);
			});
			users.count({ done: true }, function(err, rows) {
				if (rows == total_users) {
					users.update({done: true }, { $set: { done: false } }, {multi: true});
					console.log('everyone is ready');
				}
			});
		});
	});
	
	client.on('disconnect', function() {
		users.findOne({ socket_id: client.id }, function(err, user) {
			users.remove({ socket_id: client.id }, function() {
				users.find({}, function(err, results) {
					io.sockets.emit('users:updated', results);
				});
				total_users--;
			});
			console.log('Disconnected:', user.firstname + ' ' + user.lastname);
		});
	});
});