validate = function() {
	var checkEmail = function() {
		console.log('check email');
	}
}

module.exports = function(input, rules, callback) {
	for (var key in input) {
		validate.checkEmail();
		console.log(key + ': ' + input[key]);
	}
}