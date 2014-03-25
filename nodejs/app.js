var io = require('socket.io').listen(3000);
var clients = 0;

io.sockets.on('connection', function(client) {
	clients++;
	io.sockets.emit('clients_update', clients);

	client.on('disconnect', function () {
		clients--;
		io.sockets.emit('clients_update', clients);
	});
});