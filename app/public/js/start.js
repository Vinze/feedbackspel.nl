var Form = new Ractive({
	el: 'content',
	template: '#template',
	data: {
		action: 'login',
		error: null,
		input: { email: '' }
	},
	onrender: function() {
		var self = this;
		self.find('#email').focus();
	}
});

Form.on('validateEmail', function(evt) {
	evt.original.preventDefault();

	var self = this;
	var email = self.get('input.email');

	if ( ! validator.isEmail(email)) {
		self.set('error', 'Geen geldig e-mail adres.');
		return;
	}

	$.post('/api/users/check-email', { email: email }, function(email) {
		self.set('error', null);
		if (email.exists) {
			self.set('action', 'password').then(function() {
				self.find('#password').focus();
			});
		} else {
			self.set('action', 'register').then(function() {
				self.find('#firstname').focus();
			});
		}
	});

});

Form.on('validateRegister', function(evt) {
	evt.original.preventDefault();
	var self = this;
	var input = self.get('input');
	var errors = false;

	if ( ! validator.isLength(input.firstname, 2)) {
		self.set('error', 'Er is geen voornaam ingevuld!');
		self.find('#firstname').focus();
		return;
	}
	if ( ! validator.isLength(input.lastname, 2)) {
		self.set('error', 'Er is geen achternaam ingevuld!');
		self.find('#lastname').focus();
		return;
	}
	if ( ! validator.isLength(input.password, 4)) {
		self.set('error', 'Het wachtwoord moet minimaal 4 karakters lang zijn');
		self.find('#password').focus();
		return;
	}
	if (input.password != input.password2) {
		self.set('error', 'Wachtwoorden komen niet overeen!');
		self.find('#password2').focus();
		return;
	}

	$.post('/api/register', input, function(res) {
		if (res.error) {
			self.set('error', res.error);
		} else {
			Cookies.set('fbs_token', res.token, { expires: 3600 * 24 * 365 });
			window.location.replace('/dashboard');
		}
	});
});

Form.on('validatePassword', function(evt) {
	evt.original.preventDefault();

	var self = this;
	var input = self.get('input');

	if (input.email.length > 2 && input.password) {
		$.post('/api/login', input, function(res) {
			if (res.error) {
				self.set('error', res.error);
			} else {
				Cookies.set('fbs_token', res.token, { expires: 3600 * 24 * 365 });
				window.location.replace('/dashboard');
			}
		});
	} else {
		self.set('error', 'Voer een wachtwoord in!');
	}
});

Form.on('gotoLogin', function(evt, action) {
	var self  = this;
	self.set('action', 'login').then(function() {
		self.find('#email').focus();
	});
});