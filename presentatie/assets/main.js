var nextButton = document.getElementById('next');
var prevButton = document.getElementById('prev');
var screencastSlide = document.getElementById('screencast-video');
var screencastVideo = document.getElementById('video');
var screenshotSlide3 = document.getElementById('process-3-3');

function isLinux() {
	return /Linux/.test(navigator.userAgent);
}

impress().init();

nextButton.addEventListener('click', function() {
	impress().next();
});

prevButton.addEventListener('click', function() {
	impress().prev();
});

screencastSlide.addEventListener('impress:stepenter', function(evt) {
	screencastVideo.play();

	if (isLinux()) {
		document.body.style.backgroundColor = '#FCFCFC';
	} else {
		document.body.style.backgroundColor = '#FEFEFE';
		screencastVideo.style['-webkit-filter'] = 'brightness(108.5%)';
	}
}, false);

screencastSlide.addEventListener('impress:stepleave', function(evt) {
	setTimeout(function() {
		screencastVideo.pause();
		screencastVideo.currentTime = 0;
	}, 1000);
	document.body.style.backgroundColor = '#55BE78';
}, false);
