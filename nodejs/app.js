var express = require('express');
var app = express();
var HomeController = require('./app/controllers/HomeController');
var UserController = require('./app/controllers/UserController');

app.set('views', __dirname + '/app/views')
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

app.get('/', HomeController.getIndex);
app.get('/register', UserController.getRegister);

app.listen(1337);