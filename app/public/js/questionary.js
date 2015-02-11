function questionary(summary, card) {

	var random = summary[_.random(0, summary.length - 1)];

	var highest = _.max(summary, function(s) {
		return s.rating;
	});

	var lowest = _.min(summary, function(s) {
		return s.rating;
	});

	var highResults = _.filter(summary, function(s) {
		return s.rating > 3;
	});

	var lowResults = _.filter(summary, function(s) {
		return s.rating < 3;
	});

	var randomHigh = highResults[_.random(0, highResults.length - 1)];

	var randomLow = lowResults[_.random(0, lowResults.length - 1)];

	var diffHighLow = highest.rating - lowest.rating;

	var questions = [
		function() {
			// [random], je kreeg [rating] sterren voor de eigenschap [card], ben je het hiermee eens?
			return random.firstname + ', je kreeg ' + random.rating + ' sterren voor de eigenschap ' + card + ', ben je het hiermee eens?';
		},
		function() {
			return 'Waarom verdiend ' + random.firstname + ' ' + random.rating + ' sterren voor de eigenschap ' + card + '?';
		},
		function() {
			// [highest] kreeg [diff] sterren meer dan [lowest], waarom past [card] zoveel beter bij [highest]?
			if (diffHighLow >= 3) {
				return highest.firstname + ' kreeg ' + diffHighLow + ' sterren meer dan ' + lowest.firstname + ', waarom past de eigenschap ' + card + ' zoveel beter bij ' + highest.firstname + '?';
			}
			return questionary(summary, card);
		},
		function() {
			// [lowest] kreeg slechts 1 ster voor de eigenschap [card], past deze eigenschap niet bij [lowest]?
			if (lowest.rating == 1) {
				return lowest.firstname + ' kreeg slechts 1 ster voor de eigenschap ' + card + ', waarom past deze eigenschap niet bij ' + lowest.firstname + '?';
			}
			return questionary(summary, card);
		},
		function() {
			// [lowest] kreeg slechts 2 sterren voor de eigenschap [card], waarom zo weinig?
			if (lowest.rating == 2) {
				return lowest.firstname + ' kreeg slechts 2 sterren voor de eigenschap ' + card + ', waarom zo weinig?';
			}
			return questionary(summary, card);
		},
		function() {
			// Waarom is [randomHigh] [card]?
			if (randomHigh) {
				return 'Waarom is ' + randomHigh.firstname + ' ' + card + '?';
			}
			return questionary(summary, card);
		},
		function() {
			// [randomHigh] kreeg 4 sterren voor de eigenschap betrouwbaar, waaruit blijkt dat deze eigenschap zo goed past?
			if (randomHigh) {
				return randomHigh.firstname + ' kreeg ' + randomHigh.rating + ' sterren voor de eigenschap betrouwbaar, waaruit blijkt dat deze eigenschap goed bij ' + randomHigh.firstname + ' past?'
			}
			return questionary(summary, card);
		}
	];

	var randomNumber = _.random(0, questions.length - 1);

	return questions[randomNumber]();
}