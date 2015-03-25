var Start = new Ractive({
	el: 'content',
	template: '#template',
	data: {
		action: 'login',
		emailError: null,
		registerError: null,
		input: {}
	},
	onrender: function() {
		var self = this;
		self.find('#email').focus();
	}
});

Start.on('validateEmail', function(evt) {
	evt.original.preventDefault();

	var self = this;
	var input = self.get('input');

	if ( ! validator.isEmail(input.email)) {
		self.set('emailError', 'Geen geldig e-mail adres.');
		return;
	}

	$.post('/api/login', input, function(user) {
		if (user.exists) {
			Cookies.set('fbs_token', user.token, { expires: 3600 * 24 * 365 });
			window.location.replace('/dashboard');
		} else {
			self.set('action', 'register').then(function() {
				self.find('#firstname').focus();
			});
		}
	});

});

Start.on('validateRegister', function(evt) {
	evt.original.preventDefault();
	
	var self = this;
	var input = self.get('input');

	if ( ! validator.isLength(input.firstname, 1)) {
		self.set('registerError', 'Er is geen voornaam ingevuld!');
		self.find('#firstname').focus();
		return;
	}
	if ( ! validator.isLength(input.lastname, 1)) {
		self.set('registerError', 'Er is geen achternaam ingevuld!');
		self.find('#lastname').focus();
		return;
	}

	$.post('/api/register', input, function(res) {
		if (res.error) {
			self.set('registerError', res.error);
		} else {
			Cookies.set('fbs_token', res.token, { expires: 3600 * 24 * 365 });
			window.location.replace('/dashboard');
		}
	});
});

Start.on('gotoLogin', function(evt, action) {
	var self  = this;

	self.set('registerError', null);

	self.set('action', 'login').then(function() {
		self.find('#email').focus();
	});
});