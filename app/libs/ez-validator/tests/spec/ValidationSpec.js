describe('email validation:', function() {
	var rules = {
		email: { email: true }
	};

	it('should validate e-mail address as valid', function() {
		validate({ email: 'john@gmail.com' }, rules, function(errors) {
			expect(errors).toBe(false);
		});
	});

	it('shouldn\'t be a valid email address when missing domain extension', function() {
		validate({ email: 'john@examplecom' }, rules, function(errors) {
			expect(typeof errors).toBe('object');
		});
	});

	it('shouldn\'t validate when the address is missing the @)', function() {
		validate({ email: 'john.example.com' }, rules, function(errors) {
			expect(typeof errors).toBe('object');
		});
	});

	it('shouldn\'t validate when starting with an @', function() {
		validate({ email: '@example.com' }, rules, function(errors) {
			expect(typeof errors).toBe('object');
		});
	});

	it('should return an error message when validations fails', function() {
		validate({ email: 'myemailcom' }, rules, function(errors) {
			expect(errors[0].field).toBe('email');
			expect(errors[0].message).toBe('email is not a valid email address');
		});
	});
});

describe('url validation:', function() {
	var rules = {
		link: { url: true }
	};

	it('should validate a valid URL', function() {
		validate({ link: 'http://www.google.com' }, rules, function(errors) {
			expect(errors).toBe(false);
		});
	});

	it('shouldn\'t validate an URL without extension', function() {
		validate({ link: 'googlecom' }, rules, function(errors) {
			expect(typeof errors).toBe('object');
		});
	});

	it('should validate an URL without http://', function() {
		validate({ link: 'google.com' }, rules, function(errors) {
			expect(errors).toBe(false);
		});
	});

	it('shouldn\'t validate an URL starting with a non-alphanumeric character', function() {
		validate({ link: '-http://google.com' }, rules, function(errors) {
			expect(typeof errors).toBe('object');
		});
	});

	it('should validate an URL with path', function() {
		validate({ link: 'http://www.google.com/info' }, rules, function(errors) {
			expect(errors).toBe(false);
		});
	});

	it('should return an error message when validations fails', function() {
		validate({ link: 'xxx' }, rules, function(errors) {
			expect(errors[0].field).toBe('link');
			expect(errors[0].message).toBe('link is not an valid URL');
		});
	});
});

describe('same validation:', function() {
	var rules = {
		password: { required: true },
		password_repeat: { same: 'password' }
	};

	it('the password and password_repeat repeat field should be the same', function() {
		validate({ password: 'MyPassword123', password_repeat: 'MyPassword123' }, rules, function(errors) {
			expect(errors).toBe(false);
		});
	});

	it('the password and password_repeat repeat field shouldn\'t be the same', function() {
		validate({ password: 'MyPassword321', password_repeat: 'MyPassword123' }, rules, function(errors) {
			expect(typeof errors).toBe('object');
		});
	});
});

describe('minlength validation:', function() {
	var rules = {
		firstname: { minlength: 3 }
	};

	it('should return an error when the length of the input is too short', function() {
		validate({ firstname: 'V' }, rules, function(errors) {
			expect(typeof errors).toBe('object');
		});
	});

	it('shouldn\'t return an error when the length of the input is long enough', function() {
		validate({ firstname: 'Vincent' }, rules, function(errors) {
			expect(errors).toBe(false);
		});
	});
});

describe('maxlength validation:', function() {
	var rules = {
		lastname: { maxlength: 20 }
	};

	it('should return an error when the length of the input is too long', function() {
		validate({ lastname: 'Thisisjustaverylongstringthatshardtoread' }, rules, function(errors) {
			expect(typeof errors).toBe('object');
		});
	});

	it('shouldn\'t return an error when the length of the input is shorter than the maxlength', function() {
		validate({ lastname: 'Bremer' }, rules, function(errors) {
			expect(errors).toBe(false);
		});
	});

	it('should return the correct error message when the input to too long', function() {
		validate({ lastname: 'Thisisjustaverylongstringthatshardtoread' }, rules, function(errors) {
			expect(errors[0].field).toBe('lastname');
			expect(errors[0].message).toBe('lastname is too long');
		});
	});

});

describe('object validation:', function() {
	var rules = {
		email: { required: true, email: true, minlength: 4, maxlength: 60 },
		firstname: { required: true, minlength: 2, maxlength: 30 },
		lastname: { required: true, minlength: 2, maxlength: 30 },
		gender: { in: ['m', 'f'] },
		age: { between: [10, 80] }
	};

	var good = {
		email: 'vbremer@gmail.com',
		firstname: 'Vincent',
		lastname: 'Bremer',
		homepage: 'vbremer.nl',
		gender: 'm',
		age: 25
	};

	var wrong = {
		email: 'vbremer@gmailcom',
		firstname: '',
		lastname: 'Bremer',
		homepage: 'vbremer.nl',
		gender: '?',
		age: 5
	};
	
	it('object should validate without errors', function() {
		validate(good, rules, function(errors) {
			expect(errors).toBe(false);
		});
	});

	it('object shouldn\'t validate and return errors', function() {
		validate(wrong, rules, function(errors) {
			expect(typeof errors).toBe('object');
			expect(errors[0].message).toBe('email is not a valid email address');
			expect(errors[1].message).toBe('firstname is required');
			expect(errors[2].message).toBe('gender is not in array');
			expect(errors[3].message).toBe('age is not in range');
		});
	});
});