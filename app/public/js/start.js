var Form = new Ractive({
	el: 'content',
	template: '#template',
	data: {
		action: 'login',
		error: null,
		input: {}
	},
	onrender: function() {
		var self = this;
		self.find('#email').focus();
	}
});

Form.on('validateEmail', function(evt) {
	evt.original.preventDefault();

	var self = this;
	var input = self.get('input');

	if ( ! validator.isEmail(input.email)) {
		self.set('error', 'Geen geldig e-mail adres.');
		return;
	}

	$.post('/api/users/check-email', { email: input.email }, function(email) {
		self.set('error', null);
		if (email.exists) {
			$.post('/api/login', input, function(res) {
				if (res.error) {
					self.set('error', res.error);
				} else {
					Cookies.set('fbs_token', res.token, { expires: 3600 * 24 * 365 });
					window.location.replace('/dashboard');
				}
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

	if ( ! validator.isLength(input.firstname, 1)) {
		self.set('error', 'Er is geen voornaam ingevuld!');
		self.find('#firstname').focus();
		return;
	}
	if ( ! validator.isLength(input.lastname, 1)) {
		self.set('error', 'Er is geen achternaam ingevuld!');
		self.find('#lastname').focus();
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

Form.on('gotoLogin', function(evt, action) {
	var self  = this;
	self.set('action', 'login').then(function() {
		self.find('#email').focus();
	});
});