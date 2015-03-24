var spawn = require('child_process').spawn;
var fs = require('fs');
var phantomjs, err, args = {};


args.timeout = 2000;

args.resolution = process.argv[2];

args.url = process.argv[3];

args.filename = process.argv[4] || Date.now() + '.png';

phantomjs = spawn('phantomjs', ['phantom.js', args.resolution, args.url, args.filename, args.timeout]);

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