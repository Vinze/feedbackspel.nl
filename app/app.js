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

// Routes
app.get('/', function(req, res) {
	res.render('home');
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.get('/register', function(req, res) {
	res.render('register', { logged_in: false });
});

app.get('/dashboard', function(req, res) {
	res.render('dashboard', { logged_in: true });
});

app.get('/profile', function(req, res) {
	res.render('profile', { logged_in: true });
});

app.get('/game', function(req, res) {
	res.render('game', { logged_in: true });
});

// Run the server
app.listen(1337);