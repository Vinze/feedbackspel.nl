$('#register-form').isHappy({
	fields: {
		'#email': { required: true, test: happy.email, message: 'Voer een (geldig) e-mail adres in.' },
		'#firstname': { required: true, message: 'Dit veld is verplicht.' },
		'#lastname': { required: true, message: 'Dit veld is verplicht.' },
		'#password': { required: true, message: 'Dit veld is verplicht.' },
		'#password_repeat': {
			required: true,
			test: function(val) {
				return happy.equal(val, $('#password').val());
			},
			message: 'Wachtwoorden moeten overeenkomen.'
		}
	}
});