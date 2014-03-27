<?php
class UserController extends BaseController {

	public function getLogin() {
		$email = Session::get('email', '');
		return View::make('users.login', compact('email'));
	}

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

		if ($validator->passes()) {
			return Redirect::to('login')
				->with('message', 'Het account is succesvol geregistreerd, log hieronder in om verder te gaan!')
				->with('email', $input['email']);
		} else {
			return Redirect::to('/')->withErrors($validator)->withInput();
		}

	}

}