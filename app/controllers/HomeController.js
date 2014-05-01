var validate = require('../modules/obj-validator');

var input = {
	email: 'my_email@address.com',
	firstname: 'John',
	lastname: 'Cooper',
	age: 32,
	password: 'supersecret',
	password_repeat: 'supersecret',
	gender: 'm'
}
var rules = {
	email: 'required|email',
	firstname: 'required',
	lastname: 'required',
	age: 'required|numeric',
	password: 'required|min:5|max:30',
	password_repeat: 'required|same:password',
	gender: 'in:m,f'
}
validate(input, rules, function(validates, errors) {
	console.log('Validates:', validates);
	console.log('Errors:', errors);
});

var HomeController = {

	getIndex: function(req, res) {
		res.render('home/index');
	},

	getTest: function(req, res) {
		
	}
}

module.exports = HomeController;