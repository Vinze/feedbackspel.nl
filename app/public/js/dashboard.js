var resultList = new Ractive({
	el: 'results',

	template: '#result-tpl',

	data: {
		cards: [
			{ card: 'Kritisch', comments: ['Je kijkt kritisch naar eigen werk', 'Alles wat je oplevert moet goed werken'], received: 12 },
			{ card: 'Zelfverzekerd', comments: ['Je weet waar je het over hebt', 'Weinig twijfel bij je doen en laten'], received: 4 },
			{ card: 'Perfectionist', comments: ['Alles perfect enzo'], received: 10 },
			{ card: 'Leiderschap', comments: ['Je bent goed op weg, maar probeer meer overwicht te krijgen in de groep'], received: 1 },
			{ card: 'Stipt', comments: ['Je komt je afspraken na en bent vrijwel altijd op tijd'], received: 4 },
			{ card: 'Sociaal', comments: ['Prettig in omgang'], received: 7 },
			{ card: 'Behulpzaam', comments: ['Je heb veel kennis en vind het niet erg om dit te delen', 'Je neemt voor iedereen de tijd om dingen uit te leggen'], received: 9 },
			{ card: 'Laks', comments: [], received: 0 },
			{ card: 'Zwijgzaam', comments: ['Je mag jezelf soms wel wat meer laten horen', 'Probeer meer naar de voorgrond te reden'], received: 5 }
		],
		sort: function (array) {
			// return array.sort( function ( a, b ) {
			// 	return a['received'] > b['received'] ? -1 : 1;
			// });

			return array.sort(function(a, b) {
				var received1 = a.received;
				var received2 = b.received;

				var card1 = a.card.toLowerCase();
				var card2 = b.card.toLowerCase();
				
				if (received1 != received2) {
					if (received1 > received2) return -1;
					if (received1 < received2) return 1;
					return 0;
				}
				if (card1 < card2) return -1;
				if (card1 > card2) return 1;
				return 0;

			});
			// return array;
			// array = _.sortBy(array, function(item) {
			// 	return item.received;
			// }).reverse();
		},
		highest: function(array) {
			var max = _.max(array, function(item) { return item.received });
			return max.received;
		}
	}
});

resultList.on({
	open: function(evt) {
		evt.original.preventDefault();
		var index = evt.node.getAttribute('data-index');
		console.log(index);
		var selected = resultList.get('cards['+index+'].open');
		resultList.set('cards['+index+'].open', !selected);
	}
});