// Load the framework modules
var express      = require('express');
var app          = express();
var server       = require('http').Server(app);
var fs           = require('fs');
var path         = require('path');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var multer       = require('multer');
var moment       = require('moment');
var auth         = require('./libs/auth');
var db           = require('./libs/datastore');
var config       = require('./libs/config');
var flash        = require('./libs/flash');

// Load the controllers
var GameController   = require('./controllers/GameController');
var HomeController   = require('./controllers/HomeController');
var SocketController = require('./controllers/SocketController')(server);
var UserController   = require('./controllers/UserController');

// Set the middleware
// View directory
app.set('views', __dirname + '/views');

// Set the view engine (EJS)
app.set('view engine', 'ejs');

// Serve static files from the /public directory
app.use(express.static(__dirname + '/public'));

// Enabled the bodyparser middleware for accessing POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable the cookieparser middleware for accessing cookies
app.use(cookieParser(config.cookie_secret));

// Enable the session middleware for managing sessions
app.use(session({
	secret: config.session_secret,
	saveUninitialized: true, 
	resave: true
}))

// Use the mutler middleware for file uploads
app.use(multer({ dest: __dirname + '/storage/tmp/' }))

// Enable the JWToken parser
app.use(auth.tokenParser)

// Rendering flash messages
app.use(flash())

// Make the user available
app.use(require('./libs/locals'))

// Redirect to a game room if nessesary
app.use(function(req, res, next) {
	var room = parseInt(req.path.substr(1,4).replace(/[^0-9.]/g, '') || 0);

	if (room >= 1000 && room <= 9999) {
		return res.redirect('/play/' + room);
	}

	next();
});

// Routes
app.get('/', HomeController.getIndex)

app.get('/start', auth.isGuest, UserController.getStart);
app.get('/dashboard', auth.isMember, UserController.getDashboard);
app.get('/avatar/:image', auth.isMember, UserController.getAvatar);
app.post('/avatar', auth.isMember, UserController.postAvatar);
app.get('/uitloggen', auth.isMember, UserController.getLogout);

app.get('/host', auth.isMember, GameController.getCreate);
app.get('/host/:room', auth.isMember, GameController.getHost);
app.get('/play/:room', auth.isMember, GameController.getPlay);
app.get('/qrcode/:room.png', auth.isMember, GameController.getQRCode);

app.get('/users', auth.isAdmin, UserController.getIndex);

app.get('/api/users', auth.isAdmin, UserController.getUsers);
app.get('/api/user', auth.isMember, UserController.getUser);
app.post('/api/login', auth.isGuest, UserController.postLogin);
app.post('/api/register', auth.isGuest, UserController.postRegister);
app.post('/api/users/save', auth.isMember, UserController.postSave);
app.post('/api/users/check-email', UserController.postCheckEmail);
app.post('/api/users/delete', auth.isAdmin, UserController.postDelete);


app.get('/randomwords', function(req, res) {
	res.render('randomwords')
})

app.get('/kernkwadranten', function(req, res) {
	res.render('kernkwadranten')
});

app.get('/test', function(req, res) {
	res.render('test');
});

app.get('/scriptie*', function(req, res) {
	if (req.path == '/scriptie' || req.path == '/scriptie/') {
		// Get the path to index.html
		var filepath = path.resolve(__dirname, '..', 'scriptie', 'index.html');

		// Send index.html to the client
		res.sendfile(filepath);
	} else {
		// Get the path to the requested file
		var filepath = path.resolve(__dirname, '..', 'scriptie', req.path.substr(10));

		// Check if the requested file exists
		fs.exists(filepath, function(exists) {
			if ( ! exists) // File not found! (404)
				return res.status(404).end();

			// Send the file
			res.sendfile(filepath);
		});
	}
});

app.get('/access', auth.isAdmin, function(req, res) {
	// Return the logfile
	db.access.find({}).sort({ timestamp: -1 }).projection({ timestamp: 0 }).exec(function(err, docs) {
		res.json(docs);
	});
});

app.post('/access/update', function(req, res) {
	var ipaddress = req.headers['x-forwarded-for'] || 
		                req.connection.remoteAddress || 
		                req.socket.remoteAddress ||
		                req.connection.socket.remoteAddress;

	// Get the current date and time
	var now = moment();

	// Access log
	db.access.update({
		ipaddress: ipaddress,
		useragent: req.headers['user-agent']
	}, {
		$set: {
			timestamp: now.unix(),
			last_visit: now.format('DD-MM-YYYY HH:mm:ss')
		},
		$inc: {
			seconds: parseInt(req.body.seconds)
		}
	}, { upsert: true });

});

app.get('/access/clear', auth.isAdmin, function(req, res) {
	// Clear the logfile
	db.access.remove({}, { multi: true }, function (err, numRemoved) {
		// res.json({ removed: numRemoved });
		res.redirect('/access');
	});
});


app.get('*', function(req, res) {
	res.status(404);
	res.render('404');
});

// Run the server
server.listen(config.port)