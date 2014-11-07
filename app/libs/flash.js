module.exports = function flash() {
	return function(req, res, next) {
		req.flash = function(name, value) {
			if (this.session === undefined) throw Error('req.flash() requires sessions');
			var flash = this.session.flash || {};
			if (name && value) {
				flash[name] = value;
				this.session.flash = flash;
			} else if (name) {
				var value = flash[name] || '';
				delete flash[name];
				this.session.flash = flash;
				return value;
			} else {
				this.session.flash = {};
				return flash;
			}
		}
		next();
	}
}