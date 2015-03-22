var AvatarSelect = Ractive.extend({

	data: {
		uploading: false,
		uploaded: false,
		reload: true,
		image: {}
	},

	oninit: function() {
		var self = this;

		self.on('updatePreview', function(evt) {
			var file = evt.node.files[0];
			var reader = new FileReader();

			reader.readAsDataURL(file);

			reader.onload = function(evt) {
				self.set('image', {
					name: file.name,
					base64: evt.target.result
				});

				self.set('uploading', true);

				$.post('/avatar', self.get('image'), function(res) {
					if (res.error) return alert('Er is een fout opgetreden!');

					self.set('uploading', null).then(function() {
						self.set('uploaded', true);
					});

					setTimeout(function() {
						if (self.get('reload')) {
							window.location.reload();
						} else {
							self.set('uploaded', false);
						}
					}, 2000);
				});
			}
		});
	}

});