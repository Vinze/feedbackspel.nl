// $('#register-form').isHappy({
// 	fields: {
// 		'#email': { required: true, test: happy.email, message: 'Voer een (geldig) e-mail adres in.' },
// 		'#firstname': { required: true, message: 'Dit veld is verplicht.' },
// 		'#lastname': { required: true, message: 'Dit veld is verplicht.' },
// 		'#password': { required: true, message: 'Dit veld is verplicht.' },
// 		'#password_repeat': {
// 			required: true,
// 			test: function(val) {
// 				return happy.equal(val, $('#password').val());
// 			},
// 			message: 'Wachtwoorden moeten overeenkomen.'
// 		}
// 	}
// });

var ractive = new Ractive({
	el: 'content',
	template: '#template',
	data: {
		input: {},
		errors: [],
		hasError: function(value) {
			return this.get('errors').indexOf(value) > -1 ? ' has-error' : '';
		}
	}
});

ractive.on('validate', function(evt) {
	var input = ractive.get('input');
	var errors = [];

	if ( ! validator.isEmail(input.email)) {
		errors.push('email');
	} else {
		$.post('/api/users/check-email', { email: input.email }, function(exists) {
			if (exists) errors.push('email');
		});
	}

	if ( ! validator.isLength(input.firstname, 2)) {
		errors.push('firstname');
	}

	if ( ! validator.isLength(input.lastname, 2)) {
		errors.push('lastname');
	}

	if ( ! validator.isIn(input.gender, ['m', 'f'])) {
		errors.push('gender');
	}

	if ( ! validator.isLength(input.password, 3)) {
		errors.push('password');
	}

	if ( ! validator.isLength(input.password_repeat, 3)) {
		errors.push('password_repeat');
	}

	if ( ! validator.equals(input.password, input.password_repeat)) {
		errors.push('password_repeat');
	}

	ractive.set('errors', errors);

	if (errors.length > 0) {
		evt.original.preventDefault();
	}
});