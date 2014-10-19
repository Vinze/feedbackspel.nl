describe('email validation:', function() {
	var rules = { email: { email: true } };

	it('john@gmail.com should be valid address', function() {
		validate({ email: 'john@gmail.com' }, rules, function(errors) {
			expect(errors).toBe(false);
		});
	});

	it('john@examplecom should not be a valid email address (missing domain extension)', function() {
		validate({ email: 'john@examplecom' }, rules, function(errors) {
			expect(typeof errors).toBe('object');
		});
	});

	it('john.example.com should not be a valid email address (missing @)', function() {
		validate({ email: 'john.example.com' }, rules, function(errors) {
			expect(typeof errors).toBe('object');
		});
	});

	it('@example.com should not validate (starting with an @)', function() {
		validate({ email: '@example.com' }, rules, function(errors) {
			expect(typeof errors).toBe('object');
		});
	});

	it('should return an error message when validations fails', function() {
		validate({ email: 'myemailcom' }, rules, function(errors) {
			expect(errors[0].field).toBe('email');
			expect(errors[0].message).toBe('email is not an valid email address');
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

	it('the password and password_repeat repeat field should not be the same', function() {
		validate({ password: 'MyPassword321', password_repeat: 'MyPassword123' }, rules, function(errors) {
			expect(typeof errors).toBe('object');
		});
	});
});

describe('minlength validation:', function() {
	var rules = { firstname: { minlength: 3 } };

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
	var rules = { lastname: { maxlength: 20 } };

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

	it('object should validate without errors', function() {
		var input = {
			email: 'vbremer@gmail.com',
			firstname: 'Vincent',
			lastname: 'Bremer',
			homepage: 'vbremer.nl',
			gender: 'f',
			age: 25
		};

		validate(input, rules, function(errors) {
			expect(errors).toBe(false);
		});
	});

	xit('object shouldn\'t validate and return errors', function() {
	});

});