var validator = require('validator');

var validate = function(values, schema, callback) {

	var check = {
		// Check if the input validates as an email address
		email: function(field, input) {
			return validator.isEmail(input) ? false : { field: field, message: field + ' is not a valid email address' };
		},

		// Check if the input is a valid URL
		url: function(field, input) {
			return validator.isURL(input) ? false : { field: field, message: field + ' is not an valid URL' };
		},

		// Check if the input isn't too short
		minlength: function(field, input, minlength) {
			return validator.isLength(input, minlength) ? false : { field: field, message: field + ' is too short' };
		},

		// Check if the input isn't to long
		maxlength: function(field, input, maxlength) {
			return validator.isLength(input, 0, maxlength) ? false : { field: field, message: field + ' is too long' };
		},

		// Check if a number is in between a range
		between: function(field, input, range) {
			var min = range[0];
			var max = range[1];
			return validator.isLength(input, min, max) ? false : { field: field, message: field + ' is not in range' };
		},

		same: function(field, input, match) {
			return validator.equals(input, values[match]) ? false : { field: field, message: field + ' should be the same as ' + match };
		},

		// Check if the input is in the array
		in: function(field, input, array) {
			return validator.isIn(input, array) ? false : { field: field, message: field + ' is not in array' };
		},

		// Check if the input is not in the array
		notIn: function(field, input, array) {
			return validator.isIn(input, array) ? { field: field, message: field + ' is in array' } : false;
		}
	}

	// Set the errors array
	var errors = [];

	// Loop over the validation schema
	for (var field in schema) {

		// Get the rules for the field
		var rules = schema[field];

		// Loop over the rules
		for (var rule in rules) {

			// Get the specific rule value
			var value = rules[rule];

			// Check if the field is required and empty
			if (rule == 'required' && ! values[field]) {
				errors.push({
					field: field,
					message: field + ' is required'
				});
			} else {
				if (check[rule] && values[field]) {
					var error = check[rule](field, values[field], value);
					if (error) errors.push(error);
				}
			}
		}
	}

	// If any errors occured, return the array containing the errors, else return false
	callback(errors.length > 0 ? errors : false);
}

// var rules = {
// 	fieldname: {
// 		required: true,
// 		email: true,
// 		minlength: 3,
// 		maxlength: 30,
// 		same: 'otherfield',
// 		in: ['male', 'female']
// 	}
// };
// validate(input, rules, function(erros) {
// });

module.exports = validate;
