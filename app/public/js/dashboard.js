var JoinModal, closeHandler, ProfileEditor, editHandler;

JoinModal = Ractive.extend({
	el: document.body,
	append: true,
	template: '#join-tpl',
	data: { code: '' },
	oncomplete: function() {
		var self = this;

		self.on('send', function(evt) {
			var code = self.get('code');
			if (code && code >= 1000 && code < 10000) {
				window.location.href = '/play/' + code;
			}
			evt.original.preventDefault();
		});

		self.on('closeModal', function() {
			self.teardown();
		});

		self.on('stopPropagation', function(evt) {
			evt.original.stopPropagation();
		});
		
		$(window).on('keydown', closeHandler = function(evt) {
			if (evt.which == 27) {
				self.teardown();
			}
		});

		self.on('teardown', function() {
			$(window).off('keydown', closeHandler);
		});

		self.find('#code').focus();
	}
});

ProfileEditor = new Ractive({
	el: 'profile',
	template: '#profile-tpl',
	noIntro: true,
	data: { user: null, editing: null }
});

ProfileEditor.on({
	edit: function(evt) {
		var user = ProfileEditor.get('user');

		ProfileEditor.set('editing', _.clone(user)).then(function() {
			// ProfileEditor.find('#email').focus();
		});
	},
	cancel: function(evt) {
		ProfileEditor.set('editing', null);

		evt.original.preventDefault();
	},
	save: function(evt) {
		var editing = ProfileEditor.get('editing');
		console.log(editing);
		
		$.post('/api/users/save', editing, function(res) {
			ProfileEditor.set({ user: editing, editing: null });
		});

		evt.original.preventDefault();
	}
});

$.getJSON('/api/user', function(user) {
	ProfileEditor.set('user', user);
});

$('#upload-select').on('change', function() {
	var image = $('#upload-select').val();
	var tmp = image.split('.');
	var extension = tmp[tmp.length - 1].toLowerCase();

	if (['png', 'jpeg', 'jpg'].indexOf(extension) != -1) {
		$('#upload-form').submit();
	}
});

$('#join').on('click', function(evt) {
	new JoinModal();
	evt.preventDefault();
});