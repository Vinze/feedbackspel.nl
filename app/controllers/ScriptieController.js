var fs   = require('fs');
var path = require('path');

var ScriptieController = {

	getIndex: function(req, res) {
		if (req.path == '/scriptie' || req.path == '/scriptie/') {
			// Get the path to index.html
			var filepath = path.resolve(__dirname, '..', '..', 'scriptie', 'index.html');

			// Send index.html to the client
			res.sendfile(filepath);
		} else {
			// Get the path to the requested file
			var filepath = path.resolve(__dirname, '..', '..', 'scriptie', req.path.substr(10));

			// Check if the requested file exists
			fs.exists(filepath, function(exists) {
				if ( ! exists) // File not found! (404)
					return res.status(404).end();

				// Send the file
				res.sendfile(filepath);
			});
		}
	},

	getAccess: function(req, res) {
		// Return the logfile
		db.access.find({}).sort({ timestamp: -1 }).projection({ timestamp: 0 }).exec(function(err, docs) {
			res.json(docs);
		});
	},

	postAccess: function(req, res) {
		var ipaddress = req.headers['x-forwarded-for'] || 
		                req.connection.remoteAddress || 
		                req.socket.remoteAddress ||
		                req.connection.socket.remoteAddress;

		var data = {
			timestamp: moment().unix(),
			last_visit: moment().format('DD-MM-YYYY HH:mm:ss')
		};

		if (req.user) data.user = req.user.email;
		
		// Access log
		db.access.update({
			ipaddress: ipaddress,
			useragent: req.headers['user-agent']
		}, {
			$set: data,
			$inc: { seconds: parseInt(req.body.seconds) }
		}, {
			upsert: true
		});
	},

	getClearAccess: function(req, res) {
		// Clear the logfile
		db.access.remove({}, { multi: true }, function (err, numRemoved) {
			// res.json({ removed: numRemoved });
			res.redirect('/access');
		});
	}

};

module.exports = ScriptieController;