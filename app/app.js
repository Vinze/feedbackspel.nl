// Load the framework modules
var express      = require('express');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var nedb         = require('nedb');
var app          = express();

// Set the middleware
app.set('views', __dirname + '/views')
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('5^C)6TAD0t-C$di81^Sx*1fXPVxv-Cv^'));
app.use(session({ secret: 'q#CcMig&j3ky^GEZFR8toi8sDq4aI5Qf', saveUninitialized: true, resave: true }));

// Routes
app.get('/', function(req, res) {
	res.render('home');
});

// Run the server
app.listen(1337);