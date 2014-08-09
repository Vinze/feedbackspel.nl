// Load the framework modules
var express          = require('express');
var bodyParser       = require('body-parser');
var cookieParser     = require('cookie-parser');
var session          = require('express-session');
var app              = express();

// Set the middleware
app.set('views', __dirname + '/views')
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('dsadsaasddsadsdfdfgfgdfgd'));
app.use(session({ secret: 'dsadsaasddsadsdfdfgfgdfgd', saveUninitialized: true, resave: true }));

var logged_in = false;

app.use(function(req, res, next) {
	res.locals.logged_in = logged_in;
	next();
});

function isAuthenticated(req, res, next) {
	if (logged_in) {
		next();
	} else {
		res.redirect('/login');
	}
}

function isGuest(req, res, next) {
	if (logged_in) {
		res.redirect('/dashboard');
	} else {
		next();
	}
}

// Routes
app.get('/', function(req, res) {
	res.render('home');
});

app.get('/login', isGuest, function(req, res) {
	res.render('login');
});

app.post('/login', isGuest, function(req, res) {
	logged_in = true;
	res.redirect('/dashboard');
});

app.get('/logout', isAuthenticated, function(req, res) {
	logged_in = false;
	res.redirect('/');
});

app.get('/register', isGuest, function(req, res) {
	res.render('register');
});

app.post('/register', isGuest, function(req, res) {
	res.redirect('/login');
});

app.get('/dashboard', isAuthenticated, function(req, res) {
	res.render('dashboard');
});

app.get('/profile', isAuthenticated, function(req, res) {
	res.render('profile');
});

app.get('/game', isAuthenticated, function(req, res) {
	res.render('game');
});

// Run the server
app.listen(1337);