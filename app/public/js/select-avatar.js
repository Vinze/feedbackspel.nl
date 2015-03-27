var AvatarSelect = Ractive.extend({

	data: {
		uploading: false,
		uploaded: false,
		reload: true,
		image: {}
	},

	oninit: function() {
		var self = this;

		self.on('uploadImage', function(evt) {
			var file = evt.node.files[0];
			var formData = new FormData();
			var reader = new FileReader();

			formData.append('image', file, file.name);
			reader.readAsDataURL(file);

			self.set('uploading', true);

			reader.onload = function(evt) {
				$.ajax({
					url: '/avatar',
					type: 'POST',
					data: formData,
					success: function(res) {
						if (res.error) {
							self.set('uploading', false);
							self.set('uploaded', false);

							return alert('Er is een fout opgetreden!');
						}

						self.set('uploading', null).then(function() {
							self.set('uploaded', true);
						});
						
						setTimeout(function() {
							if (self.get('reload')) {
								window.location.reload();
							} else {
								self.set('image', { name: file.name, base64: evt.target.result });
								self.set('uploaded', false);
							}
						}, 2000);
					},
					contentType: false,
					processData: false
				});
			}
		});
	}
});