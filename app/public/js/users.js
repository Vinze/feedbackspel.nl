var UserList = new Ractive({
	el: 'content',
	template: '#template',
	data: { users: [], message: null }
});
UserList.on({
	save: function(evt, user) {
		$.post('/api/users/save', user, function(res) {
			UserList.set('message', user.firstname + ' ' + user.lastname + ' is gewijzigd!');
			setTimeout(function() {
				UserList.set('message', null);
			}, 2500);
			UserList.set(evt.keypath + '.updated_at', moment().format('YYYY-MM-DD HH:mm:ss'));
		});
	},
	remove: function(evt, user) {
		swal({
			title: 'Gebruiker verwijderen?',
			text: 'Let op, deze actie kan niet ongedaan gedaan worden!',
			showCancelButton: true,
			cancelButtonText: 'Annuleren',
			confirmButtonColor: '#DD5755',
			confirmButtonText: 'Verwijderen',
			closeOnConfirm: false,
			allowOutsideClick: true
		}, function() {
			$.post('/api/users/delete', user, function(res) {
				swal({
					title: 'Verwijderd!',
					text: 'De gebruiker is succesvol verwijderd.',
					type: 'success',
					timer: 1500
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