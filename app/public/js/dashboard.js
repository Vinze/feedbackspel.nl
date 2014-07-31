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



// var app = angular.module('feedbackspel', []);

// app.controller('DashboardCtrl', function($scope) {
// 	$scope.highest = 0;
// 	$scope.results = [
// 		{ card: 'Kritisch', comments: ['Je kijkt kritisch naar eigen werk', 'Alles wat je oplevert moet goed werken'], received: 12 },
// 		{ card: 'Zelfverzekerd', comments: ['Je weet waar je het over hebt', 'Weinig twijfel bij je doen en laten'], received: 4 },
// 		{ card: 'Perfectionist', comments: ['Alles perfect enzo'], received: 10 },
// 		{ card: 'Leiderschap', comments: ['Je bent goed op weg, maar probeer meer overwicht te krijgen in de groep'], received: 1 },
// 		{ card: 'Stipt', comments: ['Je komt je afspraken na en bent vrijwel altijd op tijd'], received: 4 },
// 		{ card: 'Sociaal', comments: ['Prettig in omgang'], received: 7 },
// 		{ card: 'Behulpzaam', comments: ['Je heb veel kennis en vind het niet erg om dit te delen', 'Je neemt voor iedereen de tijd om dingen uit te leggen'], received: 9 },
// 		{ card: 'Laks', comments: [], received: 0 },
// 		{ card: 'Zwijgzaam', comments: ['Je mag jezelf soms wel wat meer laten horen', 'Probeer meer naar de voorgrond te reden'], received: 5 }
// 	];
// 	$scope.open = function(card) {
// 		card.open = !card.open;
// 	}
// 	$scope.add = function() {
// 		$scope.results.push({ card: randomWord(),  comments: ['Lorem'], received: randomNumber() });
// 	}

// 	$scope.$watch('results', function() { 
// 		$scope.highest = 0;
// 		for (var i = 0; i < $scope.results.length; i++) {
// 			if ($scope.results[i].received > $scope.highest)
// 				$scope.highest = $scope.results[i].received;
// 		}
		
// 	}, true)
// });