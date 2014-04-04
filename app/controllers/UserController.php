<?php
class UserController extends BaseController {

	public function getLogin() {
		if (Auth::check()) {
			return Redirect::to('dashboard')->with('message', 'Je bent al ingelogd!');
		} else {
			$email = Session::get('email', '');
			return View::make('users.login', compact('email'));
		}
	}

	public function postLogin() {
		$email = Input::get('email');
		$password = Input::get('password');
		$remember = Input::has('remember');
		$rules = array(
			'email' => 'required|email',
			'password' => 'required'
		);

		$validator = Validator::make(Input::all(), $rules);

		if ($validator->passes()) {
			if (Auth::attempt(array('email' => $email, 'password' => $password), $remember)) {
				return Redirect::intended('dashboard');
			} else {
				return Redirect::to('login')->with('error', 'Inloggegevens zijn onjuist!')->withInput();
			}
		} else {
			return Redirect::to('login')->withErrors($validator)->withInput();
		}
	}

	public function getLogout() {
		Auth::logout();
		return Redirect::to('/')->with('message', 'Je bent succesvol uitgelogd.');
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
			$user = new User();
			$user->fill($input);
			$user->password = Hash::make($input['password']);
			$user->save();
			return Redirect::to('login')
				->with('message', 'Het account is succesvol geregistreerd, log hieronder in om verder te gaan!')
				->with('email', $user->email);
		} else {
			return Redirect::to('/')->withErrors($validator)->withInput();
		}

	}

}