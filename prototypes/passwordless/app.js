// Load the framework modules
var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var crypto       = require('crypto');
var jwt          = require('jwt-simple');
var Datastore    = require('nedb');

var db = { users: new Datastore() };
var secret = 'JftAwkG7238Jh75KokMnhi7t';

Array.prototype.contains = function(needle) {
	return (this.indexOf(needle) > -1);
}

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser(secret));

app.use(session({
	secret: secret,
	saveUninitialized: true, 
	resave: true
}));

app.use(function decodeToken(req, res, next) {
	req.user = null;
	if (req.cookies.pwlesslogintoken) {
		var token = req.cookies.pwlesslogintoken;
		var tokenData = jwt.decode(token, secret);
		db.users.findOne({ _id: tokenData.userId }, function(err, user) {
			if (user) {
				req.user = {
					_id: user._id,
					email: user.email,
					name: user.name,
					age: user.age,
					token: token
				};
			}
			next();
		});
	} else {
		next();
	}
});

function memberRoute(req, res, next) {
	if ( ! req.user) return res.redirect('/');
	next();
}

function guestRoute(req, res, next) {
	if (req.user) return res.redirect('/dashboard');
	next();
}


// {
// 	_id: frh89yfsdeiu,
// 	name: 'Vincent',
// 	email: 'vincent@mail.com',
// 	authcode: '',
// 	tokens: []
// }

app.get('/', guestRoute, function(req, res) {
	res.render('start');
});

app.post('/', guestRoute, function(req, res) {
	var email = req.body.email;
	crypto.randomBytes(16, function(ex, buf) {
		var authcode = buf.toString('hex');
		db.users.update({ email: email }, { $set: { authcode: authcode } }, { upsert: true }, function(err, doc) {
			res.redirect('/email/' + email);
		});
	});
});

app.get('/email/:email', guestRoute, function(req, res) {
	var email = req.params.email;
	db.users.findOne({ email: email }, function(err, user) {
		if ( ! user) return res.redirect('/');
		res.render('email', { authcode: user.authcode, email: email });
	});
});

app.get('/auth/:authcode', guestRoute, function(req, res) {
	var authcode = req.params.authcode;
	db.users.findOne({ authcode: authcode }, function(err, user) {
		if ( ! user) return res.redirect('/');
		var tokenData = { iat: Math.round(Date.now() / 1000), userId: user._id };
		var token = jwt.encode(tokenData, secret);
		db.users.update({ _id: user._id }, { $push: { tokens: token }, $set: { authcode: '' }  }, function(err, num) {
			res.cookie('pwlesslogintoken', token);
			res.redirect('/dashboard');
		});
	});
});

app.get('/dashboard', memberRoute, function(req, res) {
	if (req.user.name) {
		res.render('dashboard', { user: req.user });
	} else {
		res.render('profile');
	}
});

app.post('/profile', memberRoute, function(req, res) {
	db.users.update({ _id: req.user._id }, { $set: { name: req.body.name, age: req.body.age }  }, function(err, num) {
		res.redirect('/dashboard');
	});
});

app.get('/logout', memberRoute, function(req, res) {
	db.users.update({ _id: req.user._id }, { $pull: { tokens: req.user.token } });
	res.clearCookie('pwlesslogintoken');
	res.redirect('/');
});

app.get('/users', function(req, res) {
	db.users.find({}, function(err, docs) {
		res.json(docs);
	});
});


app.listen(1337);