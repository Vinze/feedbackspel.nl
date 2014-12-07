var View = {
	cached: {},
	getHTML: function(page, callback) {
		if (View.cached[page]) {
			callback(View.cached[page]);
		} else {
			qwest.get('/views/' + page).then(function(html) {
				View.cached[page] = html;
				callback(html);
			});
		}
	},
	render: function(page) {
		View.getHTML(page, function(html) {
			document.getElementById('content').innerHTML = html;
		});
	}
};

page('/', function() {
	View.render('home');
});

page('/users', function() {
	View.getHTML('users', function(html) {
		var Users = new Ractive({
			el: 'content',
			template: html,
			data: {
				items: [],
				modal: { visible: false, title: null },
				editing: {}
			}
		});

		Users.on({
			addUser: function(evt) {
				Users.set('modal', { visible: true, title: 'Add user' });
				evt.original.preventDefault();
			},
			editUser: function(evt, user) {
				Users.set('modal', { visible: true, title: 'Edit user' });
				Users.set('editing', user);
				evt.original.preventDefault();
			},
			closeModal: function() {
				Users.set('modal.visible', false);
			},
			stopPropagation: function(evt) {
				evt.original.stopPropagation();
			}
		});

		qwest.get('/api/users').then(function(items) {
			Users.set('items', items);
		})
	});
});

page('/sessions', function() {
	View.render('sessions');
});

page('*', function() {
	View.render('404');
});

page();