var UserList, flashTimeout;

UserList = new Ractive({
	el: 'content',
	template: '#template',
	data: { users: [], message: null }
});

UserList.on({
	save: function(evt, user) {
		$.post('/api/users/save', user, function(res) {
			UserList.set('message', user.firstname + ' ' + user.lastname + ' is gewijzigd!');

			if (flashTimeout) clearTimeout(flashTimeout);

			flashTimeout = setTimeout(function() {
				UserList.set('message', null);
			}, 2500);
			
			UserList.set(evt.keypath + '.updated_at', moment().format('YYYY-MM-DD HH:mm:ss'));
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
				var index = UserList.get('users').indexOf(user);
				UserList.splice('users', index, 1);
			});
		});
	}
});
$.getJSON('/api/users', function(users) {
	UserList.set('users', users);
	// console.log(users);
});