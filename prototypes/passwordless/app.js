// Load the framework modules
var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var crypto       = require('crypto');
var Datastore    = require('nedb');

var Users = new Datastore();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser('dsk432dsasak34dhsaiu'));

app.use(session({
	secret: 'guhiufhgfphkgffdp324',
	saveUninitialized: true, 
	resave: true
}));

// {
// 	_id: frh89yfsdeiu,
// 	name: 'Vincent',
// 	email: 'vincent@mail.com',
// 	authcode: '',
// 	tokens: []
// }

app.get('/start', function(req, res) {
	res.render('start');
});

app.post('/start', function(req, res) {
	var authcode = Math.round(Math.random() * 10000);
	Users.update({ email: req.body.email }, { $set: { authcode: authcode } }, { upsert: true }, function(err, doc) {
		res.redirect('/email/' + req.body.email);
	});
});

app.get('/email/:email', function(req, res) {
	Users.findOne({ email: req.params.email }, function(err, user) {
		if ( ! user) return res.redirect('/start');
		res.render('email', { authcode: user.authcode });
	});

});

app.get('/auth/:authcode', function(req, res) {
	Users.findOne({ authcode: parseInt(req.params.authcode) }, function(err, user) {
		if ( ! user) return res.redirect('/start');

		crypto.randomBytes(48, function(ex, buf) {
			var token = buf.toString('hex');
			Users.update({ _id: user._id }, { $push: { tokens: token }  }, function(err, doc) {
				res.redirect('/private');
			});
		});
		
	});

});

app.get('/private', function(req, res) {
	
});

app.get('/users', function(req, res) {
	Users.find({}, function(err, docs) {
		res.json(docs);
	});
});


app.listen(1337);