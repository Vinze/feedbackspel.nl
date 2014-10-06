var validator = require('validator');

var validate = function(input, validation) {
	var errors    = [];

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
					case 'email': // Validate email address
						if ( ! validator.isEmail(value)) {
							errors.push({ field: field, message: 'no valid email' });
						};
					break;
					case 'url': // Validate URL
						if ( ! validator.isURL(value)) {
							errors.push({ field: field, message: 'no valid URL' });
						}
					break;
					case 'numeric': // Validate number
						if ( ! validator.isNumeric(value)) {
							errors.push({ field: field, message: 'not a number' });
						}
					break;
					case 'in': // Validate if in
						if ( ! validator.isIn(value, val.split(','))) {
							errors.push({ field: field, message: 'not in range' });
						}
					break;
					case 'not_in': // Validate if NOT in
						if (validator.isIn(value, val.split(','))) {
							errors.push({ field: field, message: 'in range' });
						}
					break;
					case 'same': // Validate if same
						if ( ! validator.equals(value, input[val]))  {
							errors.push({ field: field, message: 'not the same as ' + val });
						}
					break;
					case 'min': // Validate min value
						if (value.length < val) {
							errors.push({ field: field, message: 'too short' });
						};
					break;
					case 'max': // Validate max value
						if (value.length > val) {
							errors.push({ field: field, message: 'too long' });
						};
					break;
				}
			} else if (rule == 'required') {
				// Value is not set but is required
				errors.push({ field: field, message: 'is required' });
			}
		}
	}
	// Return errors (if any)
	return errors;
}

module.exports = validate;