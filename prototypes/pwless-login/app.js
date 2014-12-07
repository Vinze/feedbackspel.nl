// Load the framework modules
var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var jwt          = require('jwt-simple');
var nodemailer   = require('nodemailer');
var moment       = require('moment');
var crypto       = require('crypto');
var Datastore    = require('nedb');

var Users = new Datastore({
	autoload: true,
	filename: 'users.db'
});

var config = {
	cookieSecret: 'CksFPbCnlzdRv3dr5hvSPR8pfaP41vdu',
	sessionSecret: 'uf9JgeclSn0zk2t14smdrbnDrM3XMym4',
	jwtokenSecret: '4685cc2582794d2157967fa9a877c097'
};

var sendMail = false;

// Set the e-mail SMTP configuration
var transporter = nodemailer.createTransport({
	host: 'smtp.mandrillapp.com',
	port: 587,
	auth: {
		user: 'vbremer89@gmail.com',
		pass: 'akf2g8TFVA5JameG1Q8Zjw'
	}
});

function parseToken(req, res, next) {
	req.user = null;
	res.locals.user = null;

	var token = (req.cookies && req.cookies.pwless_token) || null;

	if ( ! token) return next();

	function setUserInfo(user) {
		req.user = {
			_id: user._id,
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname,
			token: token
		};
		res.locals.user = req.user;
	}

	function validateToken(tokenData) {
		if (tokenData.exp > moment().unix() && tokenData.ip == req.connection.remoteAddress) {
			return true;
		} else {
			return false
		}
	}

	try {
		var tokenData = jwt.decode(token, config.jwtokenSecret);

		if (validateToken(tokenData)) {
			Users.findOne({ _id: tokenData.userId }, function(err, user) {
				if (user) setUserInfo(user);
				next();
			});
		} else {
			next();
		}
	} catch(err) {
		console.log(err);
		next();
	}
}

function checkAuth(req, res, next) {
	if (req.user) {
		next();
	} else {
		res.render('403');
	}
}

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

// Enable the JWToken parser
app.use(parseToken);

// Routes
app.get('/', function(req, res) {
	if (req.user) {
		if (req.user.firstname && req.user.lastname) {
			res.render('dashboard');
		} else {
			res.render('finish');
		}
	} else {
		res.render('start');
	}
});


app.post('/start', function(req, res) {
	if ( ! req.body.email)
		return res.redirect('/start');

	var email = req.body.email.trim();
	var code = crypto.randomBytes(16).toString('hex');

	Users.update({ email: email }, { $set: { code: code } }, { upsert: true });

	if (sendMail) {
		var loginURL = 'http://localhost:1337/login?code=' + code + '&email=' + email;
		var options = {
			from: 'Feedbackspel.nl <info@feedbackspel.nl>',
			to: email,
			subject: 'E-mail confirmation at feedbackspel.nl',
			text: 'Please click the following link to login:\n\n' + loginURL
		};
		transporter.sendMail(options, function(err, info) {
			if (err) {
				console.log('Error sending e-mail: ', err);
			} else {
				console.log('E-mail sent: ' + info.response);
				console.log(info);
			}
		});
	}

	res.redirect('/email?email=' + email + '&code=' + code);
});

app.get('/email', function(req, res) {
	var email = req.query.email;
	var code = req.query.code;

	if (sendMail) {
		res.render('email', { email: email, code: null });
	} else {
		res.render('email', { email: email, code: code });
	}
});

app.get('/login', function(req, res) {
	var email = req.query.email;
	var code = req.query.code;

	Users.findOne({ email: email }, function(err, user) {
		if (user && code == user.code) {

			var expires = moment().add(1, 'years');

			var tokenData = {
				userId: user._id,
				exp: expires.unix(),
				ip: req.connection.remoteAddress
			};

			var token = jwt.encode(tokenData, config.jwtokenSecret);

			res.cookie('pwless_token', token, { maxAge: expires.diff(moment()) });

			Users.update({ email: email }, { $set: { code: null }, $push: { tokens: token } });

			res.redirect('/');
		} else {
			return res.redirect('/');
		}
	});
});

app.post('/finish', checkAuth, function(req, res) {
	if (req.body.firstname && req.body.lastname) {
		Users.update({ _id: req.user._id }, { $set: req.body }, function(err) {
			res.redirect('/');
		});
	} else {
		res.redirect('/');
	}
});

app.get('/users', checkAuth, function(req, res) {
	res.render('users');
});

app.get('/sessions', checkAuth, function(req, res) {
	res.render('sessions');
});

app.get('/api/users', function(req, res) {
	if ( ! req.user) return res.json([]);

	Users.find({}).sort({ email: 1 }).exec(function(err, users) {
		res.json(users);
	});
});

app.post('/api/users/delete', function(req, res) {
	var userId = req.body.id;
	Users.remove({ _id: userId }, function(err) {
		Users.find({}).sort({ email: 1 }).exec(function(err, users) {
			res.json(users);
		});
	})
});

app.get('/logout', function(req, res) {
	Users.update({ email: req.user.email }, { $set: { code: null }, $pull: { tokens: req.user.token } });
	res.clearCookie('pwless_token');
	res.redirect('/');
});


app.get('/test', function(req, res) {
	res.render('test');
});

// Run the server
app.listen(1337);