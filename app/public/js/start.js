var StartFrom = new Ractive({
	el: 'content',
	template: '#template',
	data: {
		action: 'login',
		error: null,
		input: { email: 'v-br@live.nl' }
	},
	onrender: function() {
		var self = this;

		self.find('#email').focus();
	}
});

StartFrom.on('validateEmail', function(evt) {
	evt.original.preventDefault();

	var self = this;
	var email = self.get('input.email');

	if ( ! validator.isEmail(email)) {
		self.set('error', 'Geen geldig e-mail adres.');
		return;
	}

	$.post('/api/users/check-email', { email: email }, function(email) {
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

StartFrom.on('validateRegister', function(evt) {
	evt.original.preventDefault();

	console.log(this.get('input'));

	var self = this;

	self.set('action', 'loggedin');
});

StartFrom.on('validatePassword', function(evt) {
	evt.original.preventDefault();
	console.log(this.get('input'));

});

// var EmailForm = Ractive.extend({
// 	el: 'content',
// 	template: '#email-template',
// 	data: { email: 'v-br@live.nl', error: null },
// 	oninit: function() {
// 		var self = this;

// 		self.on('send', function(evt) {
// 			evt.original.preventDefault();

// 			var email = self.get('email');

// 			if ( ! validator.isEmail(email)) {
// 				self.set('error', 'Geen geldig e-mail adres.');
// 				return;
// 			}

// 			$.post('/api/users/check-email', { email: email }, function(res) {
// 				if (res.exists) {
// 					new PasswordForm({
// 						data: { email: email }
// 					});
// 				} else {
// 					new RegisterForm({
// 						data: { email: email }
// 					});
// 				}
// 			});

// 		});
// 	},
// 	onrender: function() {
// 		this.find('#email').focus();
// 	}
// });

// var RegisterForm = Ractive.extend({
// 	el: 'content',
// 	template: '#register-template',
// 	oninit: function() {
// 		var self = this;
// 		self.on('send', function(evt) {
// 			evt.original.preventDefault();
// 			new PasswordForm();

// 		});
// 	},
// 	onrender: function() {
// 		this.find('#firstname').focus();
// 	}
// });

// var PasswordForm = Ractive.extend({
// 	el: 'content',
// 	template: '#password-template'
// });

// // new EmailForm();