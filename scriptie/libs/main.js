function parseHeadings() {
	var toc = {}
	var index = 1;
	var prev;

	$(':header').each(function() {
		var tagName = $(this)[0].tagName;
		if (tagName == 'H1' || tagName =='H2') {
			var title = $(this).text();
			var slug = index + '-' + title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
			$(this).attr('id', slug);

			if (tagName == 'H1') {
				toc[index] = {
					title: title,
					slug: slug,
					sub: []
				};
				prev = index;
			} else if (tagName == 'H2') {
				toc[prev].sub.push({
					title: title,
					slug: slug
				});
			}
			index++;
		}
	});
	return toc;
}

function buildTOC(headings) {
	var html = '';
	for (var i in headings) {
		var h1 = headings[i];
		html += '<li class="heading-1"><a href="#' + h1.slug + '">' + h1.title + '</a></li>';
		for (var x in h1.sub) {
			var h2 = h1.sub[x];
			html += '<li class="heading-2"><a href="#' + h2.slug + '">' + h2.title + '</a></li>';
		}
	}
	return html;
}

$.get('/scriptie/afstudeerscriptie.md', function(content) {
	var html = marked(content);

	$('#content').html(html);

	var headings = parseHeadings();

	var toc = buildTOC(headings);

	$('#toc').html(toc);

	if (window.location.hash) {
		window.scrollTo(0, $(window.location.hash).offset().top - 20);
	}

});

$('#toc').on('click', 'a', function(evt) {
	var linkTo = $(this).attr('href');

	window.location.hash = linkTo;
	
	window.scrollTo(0, $(linkTo).offset().top - 20);

	evt.preventDefault();
});