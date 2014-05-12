/*
Simple Node.js validation module modelled after the Laravel validation. (http://laravel.com/docs/validation)
The actual validation is done using the validator module from chriso (https://github.com/chriso/validator.js)

So far I only ported the following rules:
- required
- email
- url
- numeric
- in:val1,val2,val3
- not_in:val1,val2,val3
- same:fieldname
- min:number
- max:number
If you like to add more you're more than welcome to do so!

Usage:
1. Install the validator module with npm (npm install validator)
2. Require this file

Examples:
var validate = require('../modules/obj-validator');

var data = {
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
validate(data, rules, function(validates, errors) {
	console.log('Validates:', validates);
	console.log('Errors:', errors);
});

*/

var validator = require('validator');

module.exports = function(data, validation, callback) {
	var validates = true;
	var errors    = {};

	// Loop through the validation rules
	for (var field in validation) {

		// Get the validation rules
		var rules = validation[field].split('|');

		// Get the value from the data
		var input = data[field];

		// Iterate over the rules
		for (var i = 0; i < rules.length; i++) {
			// Check if the rule contains a semicolon
			if (rules[i].indexOf(':') > -1) {
				// Get the rule and rule value(s)
				var tmp = rules[i].split(':');
				var rule = tmp[0];
				var val = tmp[1];
			} else {
				// Get the rule
				var rule = rules[i];
			}
			// Check if an value has been set
			if (input) {
				// Run the corresponding validation based on the rule
				switch(rule) {
					case 'email': // Validate email address
						if (!validator.isEmail(input)) {
							validates = false;
							errors[field] = 'no valid email';
						};
					break;
					case 'url': // Validate URL
						if (!validator.isURL(input)) {
							validates = false;
							errors[field] = 'no valid URL';
						}
					break;
					case 'numeric': // Validate number
						if (!validator.isNumeric(input)) {
							validates = false;
							errors[field] = 'not a number';
						}
					break;
					case 'in': // Validate if in
						if (!validator.isIn(input, val.split(','))) {
							validates = false;
							errors[field] = 'not in range';
						}
					break;
					case 'not_in': // Validate if NOT in
						if (validator.isIn(input, val.split(','))) {
							validates = false;
							errors[field] = 'in range';
						}
					break;
					case 'same': // Validate if same
						if (!validator.equals(input, data[val]))  {
							validates = false;
							errors[field] = 'not the same as ' + val;
						}
					break;
					case 'min': // Validate min value
						if (input.length < val) {
							validates = false;
							errors[field] = 'too short';
						};
					break;
					case 'max': // Validate max value
						if (input.length > val) {
							validates = false;
							errors[field] = 'too long';
						};
					break;
				}
			} else if (rule == 'required') {
				// Value is not set but is required
				validates = false;
				errors[field] = 'is required';
			}
		}
	}
	// Callback, validates can either be true or false
	// If validates is false, errors will contain the error messages
	callback(validates, errors);
}