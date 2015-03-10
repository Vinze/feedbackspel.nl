var UserList, flashTimeout;

UserList = Ractive.extend({
	el: 'content',
	data: { users: [], message: null },
	oninit: function() {
		var self = this;
		self.on({
			save: function(evt, user) {
				$.post('/api/users/save', user, function(res) {
					self.set('message', user.firstname + ' ' + user.lastname + ' is gewijzigd!');

					if (flashTimeout) clearTimeout(flashTimeout);

					flashTimeout = setTimeout(function() {
						self.set('message', null);
					}, 2500);
					
					self.set(evt.keypath + '.updated_at', moment().format('YYYY-MM-DD HH:mm:ss'));
				});
			},
			remove: function(evt, user) {
				swal({
					title: 'Gebruiker verwijderen?',
					text: 'Weet je zeker dat je ' + user.firstname + ' ' + user.lastname + ' wilt verwijderen?',
					showCancelButton: true,
					cancelButtonText: 'Nee',
					confirmButtonColor: '#DD5755',
					confirmButtonText: 'Ja',
					closeOnConfirm: false,
					allowOutsideClick: true
				}, function() {
					$.post('/api/users/delete', user, function(res) {
						swal({
							title: 'Gebruiker verwijderd',
							text: 'De gebruiker is succesvol verwijderd.',
							type: 'success',
							confirmButtonColor: '#55be78',
							confirmButtonText: "OK",
							timer: 2000
						});
						var index = self.get('users').indexOf(user);
						self.splice('users', index, 1);
					});
				});
			}
		});
	}
});