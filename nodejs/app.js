var io = require('socket.io').listen(3000);
var mysql2 = require('mysql2');
var base64 = require('base64');

// Connect to the MySQL database
var mysql = mysql2.createConnection({
	user: 'root',
	password: 'usbw',
	database: 'feedbackspel.nl'
});

// Load a new IMDB (in memory database)
var Datastore = require('nedb');
var users = new Datastore();

// Configure the socket
io.configure(function () {

	// Define the authorization
	io.set('authorization', function (data, accept) {
		// Decode the base64 string from the URL
		var string = base64.decode(data.query.d).split('/');

		// Set the variables
		var type = string[0];
		var token = string[1];
		var room = string[2];

		// Set the select query
		var select = 'SELECT id, email, firstname, lastname, hash FROM users WHERE token = ? LIMIT 1';

		// Check if a token is provided
		if (token != undefined && token.length > 10) {
			// Check if the token exists in the database
			mysql.query(select, [token], function(e, rows) {
				if (rows.length == 1) {
					// Store the handshake data
					data.user = rows[0];
					data.type = type;
					data.room = room;

					// Accept the connection
					accept(null, true);
				} else {
					// Deny the connection
					accept('No (valid) token provided', false);		
				}
			});
		} else {
			// Deny the connection
			accept('No (valid) token provided', false);
		}
	});

	// Set the log level to 1 (only show errors)
	io.set('log level', 1);
});

io.sockets.on('connection', function(socket) {
	// Set the data associated with the socket
	socket.user = socket.handshake.user;
	socket.type = socket.handshake.type;
	socket.room = socket.handshake.room;

	// Send the updated users list
	function updateUsers() {
		users.find({}, function(err, docs) {
			io.sockets.in(socket.room).emit('users updated', docs);
		});
	}

	// If the socket is a client, add the user
	if (socket.type == 'client') {
		var user = socket.user;
		user.socket_id = socket.id;
		users.insert(user, function(err, doc) {
			updateUsers();
		});
		console.log(socket.user.firstname + ' ' + socket.user.lastname + ' joined the room ' + socket.room);
	} else {
		console.log(socket.user.firstname + ' ' + socket.user.lastname + ' hosted the room ' + socket.room);
	}

	socket.join(socket.room);

	socket.on('feedback', function(feedback) {
		io.sockets.in(socket.room).emit('user done', socket.user.id);
		console.log(feedback);
	});

	socket.on('disconnect', function() {
		users.remove({ socket_id: socket.id }, function() {
			updateUsers();
		});
	});
});