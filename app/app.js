// Load the framework modules
var express          = require('express');
var app              = express();
var bodyParser       = require('body-parser');
var session          = require('express-session');
var passport         = require('passport');

var config           = require('./config');

// Load the controllers
var HomeController   = require('./controllers/HomeController');
var UserController   = require('./controllers/UserController');

// Config the app
app.set('views', __dirname + '/views')
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

// Set the auth stuff
// app.use(session({ secret: config.secret }));
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.get('/', HomeController.getIndex);
app.get('/register', UserController.getRegister);
app.post('/register', UserController.postRegister);
app.get('/login', UserController.getLogin);
app.post('/login', UserController.postLogin);

app.get('/test', HomeController.getTest);

// Run the server
app.listen(1337);