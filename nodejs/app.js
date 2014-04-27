var express = require('express');
var app = express();

app.configure(function() {

	app.set('views', __dirname + '/app/views')
	app.set('view engine', 'jade');

	app.use(express.static(__dirname + '/public'));

	app.use(express.bodyParser());
});

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(1337);