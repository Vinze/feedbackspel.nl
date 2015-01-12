var JoinModal = Ractive.extend({
	el: document.body,
	append: true,
	template: '#join-tpl',
	data: { code: '' },
	oncomplete: function() {
		var self = this, closeHandler;

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
		
		$(window).on('keydown', function(evt) {
			if (evt.which == 27) {
				self.teardown();
			}
		});

		self.on('teardown', function() {
			$(window).off('keydown');
		});

		self.find('#code').focus();
	}
});


$('#upload-select').on('change', function() {
	var image = $('#upload-select').val();
	$('#upload-form').submit();
});

$('#join').on('click', function(evt) {
	new JoinModal();
	evt.preventDefault();
});