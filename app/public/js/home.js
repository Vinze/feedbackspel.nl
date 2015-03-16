function resizeHandler(evt) {
	var height = $(window).height() - 57;

	$('#banner').css({ 'min-height': height });

}

window.addEventListener('resize', resizeHandler);

resizeHandler();

// var keydownHandler;
// var Gallery = Ractive.extend({
// 	el: document.body,
// 	append: true,
// 	template: '#gallery-tpl',
// 	data: {
// 		images: ['1.png', '2.png', '3.png'],
// 		current: 0
// 	},
// 	loadImage: function (imageNum) {
// 		console.log(imageNum);
// 		var images = this.get('images');

// 		while (imageNum < 0) {
// 			imageNum += images.length;
// 		}

// 		imageNum %= images.length;

// 		this.set({ current: imageNum });
// 	},
// 	onrender: function() {
// 		var self = this;
// 		window.addEventListener('keydown', keydownHandler = function(evt) {
// 			var current = self.get('current');
// 			switch (evt.which) {
// 				case 39: // right
// 					self.loadImage(current+1);
// 				break;
// 				case 37: // left
// 					self.loadImage(current-1);
// 				break;
// 				case 27: // escape
// 					self.teardown();
// 				break;
// 			}
// 		});

// 		this.on('loadImage', function (evt, imageNum) {
// 			evt.original.stopPropagation();
// 			this.loadImage(imageNum);
// 		});

// 		this.on('stopPropagation', function(evt) {
// 			evt.original.stopPropagation();
// 		});

// 		this.on('close', function(evt) {
// 			self.teardown();
// 		});

// 		self.loadImage(0);
// 	},
// 	onteardown: function() {
// 		window.removeEventListener('keydown', keydownHandler);
// 	}
// });

// $('#screenshots-button').on('click', function(evt) {
// 	new Gallery();
// });