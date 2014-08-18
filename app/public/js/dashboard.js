function randomWord() {
	var word = '', letters = "abcdefghijklmnopqrstuvwxyz";
	for (var i = 0; i < 8; i++) {
		word += letters.charAt(Math.floor(Math.random() * letters.length));
		if (i == 0) word = word.toUpperCase();
	}
	return word;
}
function randomNumber() {
	return Math.floor(Math.random() * 20);		
}

var results = _.sortBy([
	{ card: 'Kritisch', comments: ['Je kijkt kritisch naar eigen werk', 'Alles wat je oplevert moet goed werken'], received: 12 },
	{ card: 'Zelfverzekerd', comments: ['Je weet waar je het over hebt', 'Weinig twijfel bij je doen en laten'], received: 4 },
	{ card: 'Perfectionist', comments: ['Alles perfect enzo'], received: 10 },
	{ card: 'Leiderschap', comments: ['Je bent goed op weg, maar probeer meer overwicht te krijgen in de groep'], received: 1 },
	{ card: 'Stipt', comments: ['Je komt je afspraken na en bent vrijwel altijd op tijd'], received: 4 },
	{ card: 'Sociaal', comments: ['Prettig in omgang'], received: 7 },
	{ card: 'Behulpzaam', comments: ['Je heb veel kennis en vind het niet erg om dit te delen', 'Je neemt voor iedereen de tijd om dingen uit te leggen'], received: 9 },
	{ card: 'Laks', comments: [], received: 0 },
	{ card: 'Zwijgzaam', comments: ['Je mag jezelf soms wel wat meer laten horen', 'Probeer meer naar de voorgrond te reden'], received: 5 }
], function(result) {
	return -result.received;
});

var highest = _.reduce(results, function(memo, result) {
	if (result.received > memo) {
		return result.received;
	} else {
		return memo;
	}
}, 0);

var FeedbackView = _.template([
	'<tr>',
		'<td style="width: 300px">',
			'<a href="#" class="toggle-comments"><%= card %></a>',
			'<ul class="comments"><%= comments %></ul>',
		'</td>',
		'<td style="width: 150px"><%= received %> keer</td>',
		'<td>',
		'<div class="bar">',
			'<div style="width:<%= width %>px" class="fill"></div>',
		'</div>',
		'</td>',
	'</tr>'
].join('\n'));

function addResults(results) {
	var html = '';
	_.each(results, function(result) {
		var comments = '<li>' + result.comments.join('</li><li>') + '</li>';
		html += FeedbackView({
			card: result.card,
			received: result.received,
			comments: comments,
			width: (result.received / highest) * 300
		});
	});
	$('.results').append(html);
}

$('.results').on('click', '.toggle-comments', function(e) {
	e.preventDefault();
	$(this).next('.comments').toggle();
})

addResults(results);

// TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING

// REACTJS REACTJS REACTJS

var Input = React.createClass({

	displayName: 'Input',

	getInitialState: function() {
		return {
			name: 'Vincent'
		}
	},

	render: function() {
		return React.DOM.div({},
			React.DOM.h2({},
				'Hello ' + this.state.name
			),

			React.DOM.input({
				type: 'text',
				onChange: function(e) {
					console.log(e.target.value);
					this.setState({ name: e.target.value }, function() {
						console.log(React.DOM);
					});
					// this.setState();
				}
			})
		);
	}
})

React.renderComponent(
	Input(),
	document.getElementById('playground')
);

// WATCHJS WATCHJS WATCHJS

// button(id="add-person") Voeg iemand toe
// button(id="edit-person") Veranderd iemand
// button(id="delete-person") Verwijder iemand
// ul(id="people")

// var people = [];

// $(function() {
// 	people.push({ name: 'Vincent' }, { name: 'Niels' });
// });

// $('#add-person').on('click', function() {
// 	people.push({ name: 'Getie' });
// });

// $('#edit-person').on('click', function() {
// 	people[1].name = 'Hessel';
// });

// $('#delete-person').on('click', function() {
// 	unwatch(people);
// 	people.splice(1, 1);
// 	console.log(people);
// });

// watch(people, function() {
// 	console.log('people changed:');
// 	var html = _.reduce(people, function(memo, person) {
// 		return memo += '<li>' + person.name + '</li>';
// 	}, '');
// 	$('#people').html(html);
// }, 2, true);