// Load the framework modules
var express      = require('express');
var app          = express();
var server       = require('http').Server(app);
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var config       = require('./libs/config');
var auth         = require('./libs/auth');
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
app.use(auth.jwtokenParser);

// Rendering flash messages
app.use(flash());

// Make the user available
app.use(function(req, res, next) {
	res.locals.user = req.user;
	next();
});


// Routes
app.get('/', HomeController.getIndex);
app.get('/login', auth.guest, UserController.getLogin);
app.post('/login', auth.guest, UserController.postLogin);
app.get('/logout', auth.check, UserController.getLogout);
app.get('/register', auth.guest, UserController.getRegister);
app.post('/register', auth.guest, UserController.postRegister);
app.get('/dashboard', auth.check, UserController.getDashboard);

app.get('/api/users/all', auth.check, UserController.findAll);
app.get('/api/users/find/:id', auth.check, UserController.findOne);
app.get('/api/users/delete/:id', auth.check, UserController.delete);
app.post('/api/users/check-email', auth.check, UserController.checkEmail);

app.get('/kernkwadranten', auth.check, function(req, res) {
	res.render('testing/kernkwadranten');
});

app.get('/chat', auth.check, function(req, res) {
	res.render('testing/chat');
});

// Run the server
server.listen(config.port);