page.base('/spa');

page('*', function(ctx, next) {
	$.getJSON('/api/user', function(user) {
		renderMenu(user);

		ctx.user = user;

		next();
	});
});

page('/', function(ctx) {
	loadView('home.html', function(html) {
		$('#content').html(html);
		resizeHandler();
		window.addEventListener('resize', resizeHandler);
	});
});

page.exit('/', function(ctx, next) {
	window.removeEventListener('resize', resizeHandler);
	next();
});

page('/start', function(ctx) {
	loadView('start.html', function(html) {
		var view = new Form({ template: html });
	});
});

page('/dashboard', function(ctx) {
	// if ( ! ctx.user) return page('/start');

	loadView('dashboard.html', function(html) {
		var view = new Dashboard({ template: html });
		view.set('user', ctx.user);
	});
});

page('/users', function(ctx) {
	loadView('users.html', function(html) {
		var view = new UserList({ template: html });
		$.getJSON('/api/users', function(users) {
			view.set('users', users);
		});
	});
});

page('/uitloggen', function(ctx) {
	Cookies.expire('fbs_token');
	page('/');
});

page('*', function(ctx) {
	loadView('404.html', function(html) {
		$('#content').html(html);
	});
});

page();