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
	data: { user: null, editing: null, error: null }
});

ProfileEditor.on({
	edit: function(evt) {
		var user = ProfileEditor.get('user');
		ProfileEditor.set('editing', _.clone(user));
	},
	cancel: function(evt) {
		ProfileEditor.set('editing', null);
		evt.original.preventDefault();
	},
	save: function(evt) {
		var editing = ProfileEditor.get('editing');
		
		$.post('/api/users/save', editing, function(res) {
			if (res.error) return ProfileEditor.set('error', res.error);

			ProfileEditor.set({ user: res.user, editing: null });
			$('#title span').text(res.user.firstname);
		});

		evt.original.preventDefault();
	}
});

$(window).on('keydown', function(evt) {
	if (evt.which == 27) {
		ProfileEditor.set('editing', null);
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

$('#host').on('click', function(evt) {
	if (navigator.userAgent.match(/Android|iPhone|IEMobile/i)) {
		swal({
			title: 'Spel starten',
			text: 'Let op! Op de computer of laptop maak je een nieuw spel aan, en op je telefoon moet je hieraan deelnemen.',
			confirmButtonColor: '#55be78',
			confirmButtonText: "OK",
			allowOutsideClick: true
		});
		evt.preventDefault();
	} else {
		document.location.href = '/host';
	}
});

var avatarSelect = new AvatarSelect({
	el: 'avatar',
	template: '#avatar-tpl'
});

avatarSelect.set('reload', false);