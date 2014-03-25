<?php
class UserController extends BaseController {

	/**
	 * Validate and register a new user account
	 * 
	 * @return Redirect object
	 */
	public function postRegister() {
		$rules = array(
			'email'     => 'required|email',
			'password'  => 'required|same:password_repeat',
			'firstname' => 'required|min:2',
			'lastname'  => 'required|min:2',
			'gender'    => 'required|in:male,female'
		);
		$input = Input::all();
		$validator = Validator::make($input, $rules);

		nprint($input);
		nprint($validator->messages());
	}

}