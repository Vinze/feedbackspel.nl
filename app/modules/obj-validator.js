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

*/

var validator = require('validator');
var validates = true;
var errors    = [];

module.exports = function(input, validation, cb) {
	// Loop through the validation rules
	for (var field in validation) {

		// Get the validation rules
		var rules = validation[field].split('|');

		// Get the value from the input
		var value = input[field];

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
			if (value) {

				// Run the corresponding validation based on the rule
				switch(rule) {
					
					// Validate email address
					case 'email':
						if (!validator.isEmail(value)) {
							validates = false;
							errors.push({field: field, message: 'no valid email'});
						};
					break;

					// Validate URL
					case 'url':
						if (!validator.isURL(value)) {
							validates = false;
							errors.push({field: field, message: 'no valid URL'});
						}
					break;

					// Validate number
					case 'numeric':
						if (!validator.isNumeric(value)) {
							validates = false;
							errors.push({field: field, message: 'not a number'});
						}
					break;

					// Validate if in
					case 'in':
						if (!validator.isIn(value, val.split(','))) {
							validates = false;
							errors.push({field: field, message: 'not in range'});
						}
					break;

					// Validate if NOT in
					case 'not_in':
						if (validator.isIn(value, val.split(','))) {
							validates = false;
							errors.push({field: field, message: 'in range'});
						}
					break;

					// Validate if same
					case 'same':
						if (!validator.equals(value, input[val]))  {
							validates = false;
							errors.push({field: field, message: 'not the same as ' + val});
						}
					break;

					// Validate min value
					case 'min':
						if (value.length < val) {
							validates = false;
							errors.push({field: field, message: 'too short'});
						};
					break;

					// Validate max value
					case 'max':
						if (value.length > val) {
							validates = false;
							errors.push({field: field, message: 'too long'});
						};
					break;
				}
			} else if (rule == 'required') {
				// Value is not set but is required
				validates = false;
				errors.push({field: field, message: 'is required'});
			}
		}
	}
	// Callback, validates can either be true or false
	// If validates is false, errors will contain the error messages
	cb(validates, errors);
}