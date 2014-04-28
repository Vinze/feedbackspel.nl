var User = require('../models/User');

var UserController = {

	getRegister: function(req, res) {
		res.render('users/register');
	},

	postRegister: function(req, res) {
		User.insert(req.body, function(err, user) {
			console.log(user);
		});
	},

	getLogin: function(req, res) {
		var Model = function(model) {
			this.setName = function(name) {
				this.name = name;
			}
			this.getName = function() {
				return this.name;
			}

			this.find = function(id, callback) {
				callback(null, { name: 'Vincent' });
			}
		}

		var UserOne = new Model('User');
		var UserTwo = new Model('User');

		UserOne.setName('Vincent');
		UserTwo.setName('Niels');

		console.log(UserOne.getName());
		console.log(UserTwo.getName());

		res.send('login');
		
	},

	postLogin: function(req, res) {
	}
}

module.exports = UserController;