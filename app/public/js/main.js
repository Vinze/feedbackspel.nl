require.config({
	paths: {
		jquery: '/js/libs/jquery.min',
		angular: '/js/libs/angular.min',
		moment: '/js/libs/moment.min',
		responsiveNav: '/js/libs/responsive-nav.min' 
	},
	shim: {
		'angular': {
			exports: 'angular'
		}
	}
});

require(['responsiveNav'], function() {
	// var navigation = responsiveNav(".nav-collapse");
});