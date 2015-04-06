var nextButton = document.getElementById('next');
var prevButton = document.getElementById('prev');
var screencastSlide = document.getElementById('screencast-video');
var screencastVideo = document.getElementById('video');
var screenshotSlide3 = document.getElementById('process-3-3');

impress().init();

nextButton.addEventListener('click', function() {
	impress().next();
});

prevButton.addEventListener('click', function() {
	impress().prev();
});

screencastSlide.addEventListener('impress:stepenter', function(evt) {
	screencastVideo.play();
	
	document.body.style.backgroundColor = '#FEFEFE';
}, false);

screencastSlide.addEventListener('impress:stepleave', function(evt) {
	setTimeout(function() {
		screencastVideo.pause();
		screencastVideo.currentTime = 0;
	}, 1000);
	document.body.style.backgroundColor = '#55BE78';
}, false);