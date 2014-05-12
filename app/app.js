// Load the framework modules
var express          = require('express');
var bodyParser       = require('body-parser');
var cookieParser     = require('cookie-parser');
var session          = require('express-session');
var flash            = require('connect-flash')
// var passport         = require('passport');
var app              = express();

// Load the config
var config           = require('./config');

// Load the controllers
var HomeController   = require('./controllers/HomeController');
var UserController   = require('./controllers/UserController');

// Set the middleware
app.set('views', __dirname + '/views')
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(cookieParser(config.secret));
app.use(session({ secret: config.secret }));
app.use(flash());

// Set the auth stuff
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.get('/', HomeController.getIndex);
app.get('/users', UserController.getIndex);
app.get('/register', UserController.getRegister);
app.post('/register', UserController.postRegister);
app.get('/login', UserController.getLogin);
app.post('/login', UserController.postLogin);

app.get('/test', HomeController.getTest);

// Run the server
app.listen(1337);