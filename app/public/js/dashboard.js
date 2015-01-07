var JoinModal = Ractive.extend({
	el: document.body,
	append: true,
	template: '#join-tpl',
	oncomplete: function() {
		var self = this;

		self.on('send', function(evt) {
			var code = self.get('code');
			window.location.href = '/play/' + code;
			evt.original.preventDefault();
		});

		self.on('closeModal', function() {
			self.teardown();
		});

		self.on('stopPropagation', function(evt) {
			evt.original.stopPropagation();
		});

		self.find('#code').focus();
	},
	data: { code: '' }
});


$('#upload-select').on('change', function() {
	var image = $('#upload-select').val();
	$('#upload-form').submit();
	console.log(image);
});

$('#join').on('click', function(evt) {
	new JoinModal();
	evt.preventDefault();
});

$(window).on('keydown', function(evt) {
	if (evt.which == 27) {
		console.log(evt.which);
	}
});