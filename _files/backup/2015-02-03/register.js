var RegisterForm = new Ractive({
	el: 'content',
	template: '#form-tpl',
	data: {
		email:     { value: '', error: null },
		firstname: { value: '', error: null },
		lastname:  { value: '', error: null },
		gender:    { value: 'm', error: null },
		password:  { value: '', error: null },
		password2: { value: '', error: null },
		errors:    false
	}
});

RegisterForm.on({
	validate: function(evt, field) {
		RegisterForm.set('errors', false);
		RegisterForm.fire('validateEmail');
		RegisterForm.fire('validateFirstname');
		RegisterForm.fire('validateLastname');
		RegisterForm.fire('validateGender');
		RegisterForm.fire('validatePassword');

		if (RegisterForm.get('errors')) {
			evt.original.preventDefault();
		}
	},
	validateEmail: function() {
		if ( ! validator.isEmail(RegisterForm.get('email.value'))) {
			RegisterForm.set('email.error', 'Geen geldig e-mail adres');
			RegisterForm.set('errors', true);
		} else {
			$.post('/api/users/check-email', { email: RegisterForm.get('email.value') }, function(res) {
				if (res.exists) {
					RegisterForm.set('email.error', 'Dit e-mail adres is al in gebruikt');
					RegisterForm.set('errors', true);
				} else {
					RegisterForm.set('email.error', null);
				}
			});
		}
	},
	validateFirstname: function() {
		if ( ! validator.isLength(RegisterForm.get('firstname.value'), 2)) {
			RegisterForm.set('firstname.error', 'Dit veld is verplicht');
			RegisterForm.set('errors', true);
		} else {
			RegisterForm.set('firstname.error', null);
		}
	},
	validateLastname: function() {
		if ( ! validator.isLength(RegisterForm.get('lastname.value'), 2)) {
			RegisterForm.set('lastname.error', 'Dit veld is verplicht');
			RegisterForm.set('errors', true);
		} else {
			RegisterForm.set('lastname.error', null);
		}
	},
	validateGender: function() {
		if ( ! validator.isIn(RegisterForm.get('gender.value'), ['m', 'f'])) {
			RegisterForm.set('gender.error', 'Dit veld is verplicht');
			RegisterForm.set('errors', true);
		} else {
			RegisterForm.set('gender.error', null);
		}
	},
	validatePassword: function() {
		if ( ! validator.isLength(RegisterForm.get('password.value'), 4)) {
			RegisterForm.set('password.error', 'Het wachtwoord moet minimaal 4 karakters lang zijn');
			RegisterForm.set('errors', true);
		} else if (RegisterForm.get('password.value') != RegisterForm.get('password2.value')) {
			RegisterForm.set('password.error', null);
			RegisterForm.set('password2.error', 'Wachtwoorden komen niet overeen!');
		} else {
			RegisterForm.set('password.error', null);
			RegisterForm.set('password2.error', null);
		}
	}
});

RegisterForm.find('#email').focus();