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
			data: { items: [] }
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