// Load the framework modules
var express      = require('express');
var app          = express();
var server       = require('http').Server(app);
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var multer       = require('multer');
var auth         = require('./libs/auth');
var config       = require('./libs/config');
var flash        = require('./libs/flash');

// Load the controllers
var GameController   = require('./controllers/GameController');
var HomeController   = require('./controllers/HomeController');
var SocketController = require('./controllers/SocketController')(server);
var UserController   = require('./controllers/UserController');

// Set the middleware

// View directory
app.set('views', __dirname + '/views');

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
}))

// Use the mutler middleware for file uploads
app.use(multer({ dest: './storage/tmp/'}))

// Enable the JWToken parser
app.use(auth.tokenParser)

// Rendering flash messages
app.use(flash())

// Make the user available
app.use(require('./libs/locals'))

// Routes
app.get('/', HomeController.getIndex)

app.get('/login', auth.isGuest, UserController.getLogin);
app.get('/register', auth.isGuest, UserController.getRegister);
app.post('/register', auth.isGuest, UserController.postRegister);
app.get('/logout', auth.isMember, UserController.getLogout);

app.get('/dashboard', auth.isMember, UserController.getDashboard);
app.get('/avatar/:image', auth.isMember, UserController.getAvatar);
app.post('/avatar', auth.isMember, UserController.postAvatar);

app.get('/host/:room', auth.isMember, GameController.getHost);
app.get('/play/:room', auth.isMember, GameController.getPlay);

app.post('/api/login', auth.isGuest, UserController.postLogin);
app.get('/api/users', auth.isAdmin, UserController.getUsers);
app.post('/api/users/save', auth.isAdmin, UserController.postSave);
app.post('/api/users/check-email', UserController.getEmail);
app.post('/api/users/delete', auth.isAdmin, UserController.postDelete);


app.get('/randomwords', function(req, res) {
	res.render('randomwords')
})

app.get('/kernkwadranten', function(req, res) {
	res.render('kernkwadranten')
})

// app.get(/\/admin(.*?)/, auth.isAdmin, function(req, res) {
// 	res.render('admin')
// })

app.get('/test', function(req, res) {
	res.redirect('/');
});

//================================================
// Testing testing testing testing testing testing
//================================================

// var UserController2   = require('./controllers/UserController2');

// app.get('/api2/users', UserController2.getUsers);

//================================================
// Testing testing testing testing testing testing
//================================================

// Run the server
server.listen(config.port)