require.config({
	baseUrl: 'js'
	paths: {
		zepto: 'libs/zepto.min',
		happy: 'libs/happy',
		shim: {
			'happy': ['zepto']
		}
	}
});