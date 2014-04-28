// Load the framework modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Load the controllers
var HomeController = require('./controllers/HomeController');
var UserController = require('./controllers/UserController');

// Config the app
app.set('views', __dirname + '/views')
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

// Routes
app.get('/', HomeController.getIndex);
app.get('/register', UserController.getRegister);
app.post('/register', UserController.postRegister);
app.get('/login', UserController.getLogin);

// Run the server
app.listen(1337);