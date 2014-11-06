// Load the framework modules
var express      = require('express');
var app          = express();
var server       = require('http').Server(app);
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var auth         = require('./libs/auth');
var config       = require('./libs/config');
var flash        = require('./libs/flash');

// Load the controllers
var HomeController   = require('./controllers/HomeController');
var UserController   = require('./controllers/UserController');
var SocketController = require('./controllers/SocketController')(server);

// Set the middleware

// View directory
app.set('views', __dirname + '/views')

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
}));

// Enable the JWToken parser
app.use(auth.tokenParser);

// Rendering flash messages
app.use(flash());

// Make the user available
app.use(function(req, res, next) {
	res.locals.user = req.user;
	console.log(req.user);
	next();
});

// Routes
app.get('/', HomeController.getIndex);
app.get('/login', auth.isGuest, UserController.getLogin);
app.post('/login', auth.isGuest, UserController.postLogin);
app.get('/logout', auth.isMember, UserController.getLogout);
app.get('/register', auth.isGuest, UserController.getRegister);
app.post('/register', auth.isGuest, UserController.postRegister);
app.get('/dashboard', auth.isMember, UserController.getDashboard);

app.get('/users', auth.isAdmin, function(req, res) {
	res.render('users/index');
});

app.post('/api/check-email', UserController.postCheckEmail);

app.get('/kernkwadranten', function(req, res) {
	res.render('kernkwadranten');
});

app.get('/chat', auth.isMember, function(req, res) {
	res.render('testing/chat');
});

// Run the server
server.listen(config.port);
