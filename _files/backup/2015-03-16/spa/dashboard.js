var Dashboard = Ractive.extend({
	el: 'content',
	data: { user: null, editing: null, error: null },
	oninit: function() {
		var self = this;
		self.on({
			edit: function(evt) {
				var user = self.get('user');
				self.set('editing', _.clone(user));
			},
			cancel: function(evt) {
				self.set('editing', null);
				evt.original.preventDefault();
			},
			save: function(evt) {
				var editing = self.get('editing');
				
				$.post('/api/users/save', editing, function(res) {
					if (res.error)
						return self.set('error', res.error);

					self.set({ user: res.user, editing: null });
				});

				evt.original.preventDefault();
			}
		});
	}
});
