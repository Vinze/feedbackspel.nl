// Find and parse all H1 and H2 headings
function parseHeadings() {
	var toc = {}
	var index = 1;
	var prevH1;

	// Loop over each heading
	$(':header').each(function() {
		// Get the tag name
		var tagName = $(this)[0].tagName;

		// Only process H1 and H2 headings
		if (tagName == 'H1' || tagName =='H2') {

			// Get the heading text
			var title = $(this).text();

			// Create a URL save slug
			var slug = index + '-' + title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');

			// Set the ID of the heading
			$(this).attr('id', slug);

			// Check if we found an H1 or and H2
			if (tagName == 'H1') {
				// Add it to the table of content
				toc[index] = {
					title: title,
					slug: slug,
					sub: []
				};
				prevH1 = index;
			} else if (tagName == 'H2') {
				// Push it to the sub items of the parent H1
				toc[prevH1].sub.push({
					title: title,
					slug: slug
				});
			}
			// Increment the index used for the ID
			index++;
		}
	});
	return toc;
}

// Create the HTML for the table of contents
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

	$('#toc').append(toc);

	hljs.initHighlightingOnLoad();

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

var seconds = 0;

setInterval(function() {
	seconds++;
}, 1000);

window.onbeforeunload = function() {
	$.post('/access/update', { seconds: seconds });
}