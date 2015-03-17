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
function buildTOC() {
	var headings = parseHeadings();
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

function editLinks() {
	$('#content a').each(function() {
		if ($(this).attr('href').substr(0, 4) == 'http') {
			$(this).attr({ 'target': '_blank' });
		}
	});
}

$.get('/scriptie/afstudeerscriptie.md', function(content) {
	var html = marked(content);
	$('#content').html(html);
	
	var toc = buildTOC();
	$('#toc').append(toc);

	editLinks();

	hljs.initHighlightingOnLoad();

	if (window.location.hash) {
		window.scrollTo(0, $(window.location.hash).offset().top - 20);
	}

	if ( ! /localhost/.test(window.location)) {
		$('#test-vid').prepend('<iframe width="700" height="418" src="https://www.youtube.com/embed/ahAJmDIjdII" frameborder="0" allowfullscreen class="hide-print"></iframe>');
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