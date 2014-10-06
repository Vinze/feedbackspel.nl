// Load the framework modules
var express      = require('express');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var config       = require('./config');
var auth         = require('./helpers/auth');
var app          = express();

// Load the controllers
var HomeController = require('./controllers/HomeController');
var UserController = require('./controllers/UserController');

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

// Routes
app.get('/', HomeController.getIndex);
app.get('/login', UserController.getLogin);
app.post('/login', UserController.postLogin);
app.get('/logout', auth.LoggedIn, UserController.getLogout);
app.get('/register', UserController.getRegister);
app.post('/register', UserController.postRegister);
app.get('/dashboard', auth.LoggedIn, UserController.getDashboard);

app.get('/api/users/all', UserController.findAll);
app.get('/api/users/find/:id', UserController.findOne);
app.get('/api/users/delete/:id', UserController.delete);
app.post('/api/users/check-email', UserController.checkEmail);

app.get('/kernkwadranten', function(req, res) {
	res.render('kernkwadranten');
});

// Run the server
app.listen(config.port);