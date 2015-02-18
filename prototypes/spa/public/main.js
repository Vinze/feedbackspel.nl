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

var UserList = Ractive.extend({
	el: 'content',
	data: {
		items: [],
		modal: { visible: false, title: null },
		editing: {}
	},
	oninit: function() {
		this.on({
			addUser: function(evt) {
				this.set('modal', { visible: true, title: 'Add user' });
				evt.original.preventDefault();
			},
			editUser: function(evt, user) {
				this.set('modal', { visible: true, title: 'Edit user' });
				this.set('editing', user);
				evt.original.preventDefault();
			},
			closeModal: function() {
				this.set('modal.visible', false);
			},
			stopPropagation: function(evt) {
				evt.original.stopPropagation();
			}
		});
	}
});

var UserModal = Ractive.extend({
	el: document.body,
	append: true
})

page('/', function() {
	View.render('home');
});

page('/users', function() {
	View.getHTML('users', function(html) {
		var userList = new UserList({
			template: html
		});

		qwest.get('/api/users').then(function(items) {
			userList.set('items', items);
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