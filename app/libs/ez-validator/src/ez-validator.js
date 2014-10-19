var validate = function(values, schema, callback) {

	var check = {
		// Check if the input validates as an email address
		email: function(field, input) {
			var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if ( ! pattern.test(input)) {
				return { field: field, message: field + ' is not an valid email address' };
			} else {
				return false;
			}
		},

		url: function(field, input) {
		},

		// Check if the input isn't too short
		minlength: function(field, input, minlength) {
			if (input.length < minlength)
				return { field: field, message: field + ' is too short' };
			else
				return false;
		},

		// Check if the input isn't to long
		maxlength: function(field, input, maxlength) {
			if (input.length > maxlength)
				return { field: field, message: field + ' is too long' };
			else
				return false;
		},

		// Check if a number is in between a range
		between: function(field, input, range) {
			var min = range[0];
			var max = range[1];
			if (input < min || input > max)
				return { field: field, message: field + ' is not in range' };
			else
				return false;
		},

		same: function(field, input, match) {
			if (input != values[match])
				return { field: field, message: field + ' should be the same as ' + match };
			else
				return false;
		},

		// Check if the input is in the array
		in: function(field, input, array) {
			if (array.indexOf(input) == -1)
				return { field: field, message: field + ' is not in array' };
			else
				return false;
		},

		// Check if the input is not in the array
		notIn: function(field, input, array) {
			if (array.indexOf(input) != -1)
				return { field: field, message: field + ' is in array' };
			else
				return false;
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

if (typeof module !== 'undefined' && module.exports) {
	module.exports = validate;
}