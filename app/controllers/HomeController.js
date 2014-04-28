var HomeController = {

	getIndex: function(req, res) {
		res.render('home/index');
	},

	getTest: function(req, res) {
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

	}
}

module.exports = HomeController;