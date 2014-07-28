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

// Run the server
app.listen(1337);