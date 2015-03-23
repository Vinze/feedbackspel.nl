// Load the framework modules
var express      = require('express');
var app          = express();
var server       = require('http').Server(app);
var fs           = require('fs');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var multer       = require('multer');
var moment       = require('moment');
var auth         = require('./libs/auth');
var config       = require('./libs/config');
var flash        = require('./libs/flash');

// Load the controllers
var GameController     = require('./controllers/GameController');
var SocketController   = require('./controllers/SocketController')(server);
var UserController     = require('./controllers/UserController');
var ScriptieController = require('./controllers/ScriptieController');

// Set the middleware
// View directory
app.set('views', __dirname + '/views');

// Set the view engine (EJS)
app.set('view engine', 'ejs');

// Serve static files from the /public directory
app.use(express.static(__dirname + '/public'));

// Enabled the bodyparser middleware for accessing POST data
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json());

// Enable the cookieparser middleware for accessing cookies
app.use(cookieParser(config.cookie_secret));

// Enable the session middleware for managing sessions
app.use(session({
	secret: config.session_secret,
	saveUninitialized: true, 
	resave: true
}));

// Use the mutler middleware for file uploads
app.use(multer({ dest: __dirname + '/storage/tmp/' }));

// Enable the JWToken parser
app.use(auth.tokenParser);

// Rendering flash messages
app.use(flash());

// Make the user available
app.use(require('./libs/locals'));

// Redirect to a game room if the route is four digits
app.use(GameController.roomParser);

app.use(function (req, res, next) {

	var time = moment().format('YYYY-MM-DD HH:mm:ss');

	var writeLine = [
		time,
		req.method,
		req.url,
		(req.user ? req.user.email : 'guest'),
		(req.headers['user-agent'] || '?'),
		(req.headers['x-forwarded-for'] || req.connection.remoteAddress || '?')
	].join('\t');

	if (req.url.substr(0, 10) != '/scriptie/' && req.url.substr(0, 8) != '/avatar/') {
		fs.appendFile(__dirname + '/storage/access.log', writeLine + '\n', function (err) {
			if (err) console.log(err);
		});
	}

	next();
});

// Home route
app.get('/', function(req, res) {
	res.render('home');
});

// UserController
app.get('/start', auth.isGuest, UserController.getStart);
app.get('/dashboard', auth.isMember, UserController.getDashboard);
app.get('/avatar/:image', UserController.getAvatar);
app.post('/avatar', auth.isMember, UserController.postAvatar);
app.get('/uitloggen', auth.isMember, UserController.getLogout);

// GameController
app.get('/host', auth.isMember, GameController.getCreate);
app.get('/host/:room', auth.isMember, GameController.getHost);
app.get('/play/:room', auth.isMember, GameController.getPlay);
// app.get('/qrcode/:room.png', auth.isMember, GameController.getQRCode);

// Secure user index
app.get('/users', auth.isAdmin, UserController.getIndex);

// API routes
app.get('/api/users', auth.isAdmin, UserController.getUsers);
app.get('/api/user', UserController.getUser);
app.post('/api/login', auth.isGuest, UserController.postLogin);
app.post('/api/register', auth.isGuest, UserController.postRegister);
app.post('/api/users/save', auth.isMember, UserController.postSave);
app.post('/api/users/check-email', UserController.postCheckEmail);
app.post('/api/users/delete', auth.isAdmin, UserController.postDelete);

// ScriptieController
app.get('/scriptie*', ScriptieController.getIndex);
app.get('/access', auth.isAdmin, ScriptieController.getAccess);
app.post('/access/update', auth.isAdmin, ScriptieController.postAccess);
app.get('/access/clear', auth.isAdmin, ScriptieController.getClearAccess);

app.get('/randomwords', function(req, res) {
	res.render('randomwords')
})

app.get('/kernkwadranten', function(req, res) {
	res.render('kernkwadranten')
});

app.get('/test', function(req, res) {
	res.render('test');
});

app.get('*', function(req, res) {
	res.status(404);
	res.render('404');
});

// Run the server
server.listen(config.port);