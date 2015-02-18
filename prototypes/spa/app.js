// Load the framework modules
var express      = require('../../app/node_modules/express');
var app          = express();
var bodyParser   = require('../../app/node_modules/body-parser');
var cookieParser = require('../../app/node_modules/cookie-parser');
var session      = require('../../app/node_modules/express-session');
var _            = require('../../app/node_modules/underscore');

var config = {
	cookieSecret: 'CksFPbCnlzdRv3dr5hvSPR8pfaP41vdu',
	sessionSecret: 'uf9JgeclSn0zk2t14smdrbnDrM3XMym4',
	jwtokenSecret: '4685cc2582794d2157967fa9a877c097'
};

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
app.use(cookieParser(config.cookieSecret));

// Enable the session middleware for managing sessions
app.use(session({
	secret: config.sessionSecret,
	saveUninitialized: true, 
	resave: true
}));

var users = [
	{ _id: 1, firstname: 'Vincent', lastname: 'Bremer', email: 'vbremer89@gmail.com' },
	{ _id: 2, firstname: 'Tjerk', lastname: 'Dijkstra', email: 'tjerk.dijkstra@mail.com' },
	{ _id: 3, firstname: 'Tjisse', lastname: 'Reitsma', email: 'info@tjrdesign.nl' },
	{ _id: 4, firstname: 'Ronald', lastname: 'Groot Jebbink', email: 'ronaldgrootjebbink@gmail.com' },
	{ _id: 5, firstname: 'Koop', lastname: 'Otten', email: 'koopotten@gmail.com' },
	{ _id: 6, firstname: 'Harold', lastname: 'Mulder', email: 'xx@mail.com' }
];

function findUser(userId) {
	return _.find(users, function(user) {
		return user._id == userId;
	});
}

// Routes
app.get('/views/*', function(req, res) {
	res.render(req.path.substring(7) + '.ejs');
});

app.get('/api/users', function(req, res) {
	res.json(users);
});

app.get('/api/users/:userId', function(req, res) {
	var user = findUser(req.params.userId);
	res.json(user);
});

app.post('/api/users/save', function(req, res) {
	var user;
	
	if (req.body._id) {
		user = findUser(req.body._id);
	}
	
	_.extend(user, req.body);

	res.json(user);
});

app.post('/api/users/delete', function(req, res) {
	// req.body._id;
});


app.get('*', function(req, res) {
	res.render('index');
});

// Run the server
app.listen(1337);