var LoginForm = new Ractive({
	el: 'form',
	template: '#form-template',
	data: {
		input: { email: '', password: '' },
		message: { error: null, success: null }
	}
});

LoginForm.on('send', function(evt) {
	var input = LoginForm.get('input');
	if (input.email.length > 2 && input.password) {
		$.post('/api/login', input, function(res) {
			if (res.error) {
				LoginForm.set('message.error', res.error);
			} else {
				Cookies.set('fbs_token', res.token, { expires: 3600 * 24 * 365 });
				window.location.replace('/start');
			}
		});
	} else {
		LoginForm.set('message.error', 'Voer een e-mail adres & wachtwoord in!');
	}
	evt.original.preventDefault();
});

if (location.search) {
	var params = location.search.split('=');
	if (params.length == 2) {
		LoginForm.set('input.email', params[1]);
		LoginForm.set('message.success', 'Je kunt nu inloggen!');
	}
}

LoginForm.find('#email').focus();