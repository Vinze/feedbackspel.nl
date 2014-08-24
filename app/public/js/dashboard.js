var cards = [
	{ card: 'Kritisch', comments: ['Je kijkt kritisch naar eigen werk', 'Alles wat je oplevert moet goed werken'], received: 8 },
	{ card: 'Zelfverzekerd', comments: ['Je weet waar je het over hebt', 'Weinig twijfel bij je doen en laten'], received: 4 },
	{ card: 'Perfectionist', comments: ['Alles perfect enzo'], received: 5 },
	{ card: 'Leiderschap', comments: ['Je bent goed op weg, maar probeer meer overwicht te krijgen in de groep'], received: 1 },
	{ card: 'Stipt', comments: ['Je komt je afspraken na en bent vrijwel altijd op tijd'], received: 1 },
	{ card: 'Sociaal', comments: ['Prettig in omgang'], received: 7 },
	{ card: 'Behulpzaam', comments: ['Je heb veel kennis en vind het niet erg om dit te delen', 'Je neemt voor iedereen de tijd om dingen uit te leggen'], received: 9 },
	{ card: 'Laks', comments: [], received: 0 },
	{ card: 'Zwijgzaam', comments: ['Je mag jezelf soms wel wat meer laten horen', 'Probeer meer naar de voorgrond te reden'], received: 5 }
];

var resultList = new Ractive({
	el: 'results',

	template: '#result-tpl',

	data: {
		cards: cards,

		sort: function (array) {
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
		},

		highest: function() {
			var max = _.max(this.get('cards'), function(item) { return item.received });
			return max.received;
		},

		totalReceived: function() {
			return _.reduce(this.get('cards'), function(memo, card) {
				return memo + card.received;
			}, 0);
		}
	}
});

resultList.on({
	open: function(evt) {
		evt.original.preventDefault();
		this.toggle( evt.keypath + '.open' );
	},
	addOne: function(evt) {
		evt.original.preventDefault();
		cards.push({ card: randomWord(), comments: ['Lorem ipsum...'], received: randomNum() });
	}
});

var words = ['aangenaam','aangepast','aanhankelijk','aanpassend','aantrekkelijk','agressief','achterdochtig','behendig','behoedzaam','bescheiden','beschermend','creatief','contactloos','eerlijk','eigenwijs','eigenzinnig','doorzettend','dominant','flexibel','flink','gehoorzaam','gemeenschappelijk','gemoedelijk','gulzig','grappig','heftig','helder','hulpvaardig','humeurig','ijverig','imiterend','imponerend','inactief','ingenieus','ingewikkeld','innemend','intelligent','intensief','jaloers','kalm','kieskeurig','krachtig','kunstig','kwetsbaar','lawaaierig','leergierig','leerzaam','leidinggevend','lief','liefdevol','lui','luidruchtig','materialistisch','medelijdend','melancholiek','mensenschuw','merkwaardig','moedig','mooi','muzikaal','nieuwsgierig','nors','nuttig','oppervlakkig','praktisch','prikkelbaar','rustig samenwerkend','scherpzinnig','schitterend','slim','slordig','sluw','sober','sportief','spottend','standvastig','stil','stoutmoedig','strijdlustig','sympatiek','taai','tam','teder','temperamentvol','teruggetrokken','tevreden','toneelspelend','traag','trots','trouw','volgzaam','volhardend','volhoudend','wispelturig','wisselvallig','zeldzaam','zelfbewust','zelfstandig','zelfvertrouwend','zelfzeker','zintuigelijk','zorgzaam'];

var cache = [];
function randomWord() {
	if (cache.length != words.length) {
		var num = Math.floor(Math.random() * words.length);
		var word = words[num];
		if (cache.indexOf(word) > -1) {
			randomWord();
		} else {
			cache.push(word);
			return word.charAt(0).toUpperCase() + word.slice(1);
		}
	}
}

function randomNum() {
   return Math.floor(Math.random() * 10);
}

