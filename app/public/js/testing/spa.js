var templateCache = {};

var currentUser = null;

function loadTemplate(view, callback) {
	if (templateCache[view])
		return callback(templateCache[view]);
	
	$.get('/templates/' + view, function(html) {
		templateCache[view] = html;
		callback(html);
	});
}

page.base('/spa');

page('/', function() {
	function resizeHandler(evt) {
		var height = $(window).height() - 64;

		$('#banner').css({ 'min-height': height });

	}

	loadTemplate('home.html', function(html) {
		$('#content').html(html);

		resizeHandler();

		window.addEventListener('resize', resizeHandler);
	});
});

page('/dashboard', function() {
	loadTemplate('dashboard.html', function(html) {
		var dashboard = new Dashboard({
			template: html,
			data: { user: currentUser }
		});
	});
});

page('/users', function() {
	loadTemplate('users.html', function(html) {
		var userlist = new UserList({
			template: html
		});
		$.getJSON('/api/users', function(users) {
			userlist.set('users', users);
		});
	});
})

$.getJSON('/api/user', function(user) {
	currentUser = user

	// Start the routing!
	page();
});
