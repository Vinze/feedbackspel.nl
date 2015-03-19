var spawn = require('child_process').spawn;
var fs = require('fs');
var phantomjs, err, args = {};

args.filename = Date.now() + '.png';

args.timeout = 2000;

args.url = process.argv[2] + '?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJIdUNXUUp0SHZlNGMzdDhHIiwiaXAiOiI6OjEiLCJleHAiOjE0NDI1NjQ4OTUsImlhdCI6MTQyNjY3MDg5NX0.N6VIVliQ0YEr1W0zwosN5-SkLhG3da0wNaEKjMjMePU';

args.device = 'desktop';

phantomjs = spawn('phantomjs', ['phantom.js', args.device, args.url, args.filename, args.timeout]);

phantomjs.stderr.on('data', function (data) {
	err = data;
});

phantomjs.on('close', function() {
	if (err) {
		console.log(err);
	} else {
		console.log('done');
	}
});

