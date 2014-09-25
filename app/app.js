// Load the framework modules
var express      = require('express');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var nedb         = require('nedb');
var app          = express();

// Load the controllers
var HomeController = require('./controllers/HomeController');

// Set the middleware

// View directory
app.set('views', __dirname + '/views')

// Set the view engine (Jade)
app.set('view engine', 'jade');

// Serve static files from the /public directory
app.use(express.static(__dirname + '/public'));

// Enabled the bodyparser middleware for accessing POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable the cookieparser middleware for accessing cookies
app.use(cookieParser('5^C)6TAD0t-C$di81^Sx*1fXPVxv-Cv^'));

// Enable the session middleware for managing sessions
app.use(session({
	secret: 'q#CcMig&j3ky^GEZFR8toi8sDq4aI5Qf',
	saveUninitialized: true, 
	resave: true
}));

// Routes
app.get('/', HomeController.getIndex);

// Run the server
app.listen(1337);