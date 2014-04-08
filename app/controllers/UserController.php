<?php
class UserController extends BaseController {

	/**
	 * Login page
	 * @return [type] [description]
	 */
	public function getLogin() {
		// Check if the user is already logged in
		if (Auth::check()) return Redirect::to('dashboard');
		
		$email = Session::get('email', '');
		return View::make('users.login', compact('email'));
	}

	/**
	 * When the user posts the login form the validation and
	 * redirection will ben handled here.
	 * 
	 * @return object
	 */
	public function postLogin() {
		$rules = array(
			'email' => 'required|email',
			'password' => 'required'
		);
		$validator = Validator::make(Input::all(), $rules);

		if ($validator->passes()) {
			$email = Input::get('email');
			$password = Input::get('password');
			$remember = Input::has('remember');
			if (Auth::attempt(array('email' => $email, 'password' => $password), $remember)) {
				return Redirect::intended('dashboard');
			} else {
				return Redirect::to('login')->with('error', 'Inloggegevens zijn onjuist!')->withInput();
			}
		} else {
			return Redirect::to('login')->withErrors($validator)->withInput();
		}
	}

	/**
	 * Logout the user
	 * 
	 * @return object Redirect object
	 */
	public function getLogout() {
		Auth::logout();
		return Redirect::to('/')->with('message', 'Je bent succesvol uitgelogd.');
	}

	/**
	 * Register page
	 * 
	 * @return View object
	 */
	public function getRegister() {
		// Check if the user is already logged in
		if (Auth::check()) return Redirect::to('dashboard');

		return View::make('users.register');
	}

	/**
	 * Validate and register a new user account
	 * 
	 * @return Redirect object
	 */
	public function postRegister() {
		$rules = array(
			'email'     => 'required|email',
			'password'  => 'required|same:password2',
			'password2'  => 'required',
			'firstname' => 'required|min:2',
			'lastname'  => 'required|min:2',
			'gender'    => 'required|in:m,f'
		);
		$input = Input::all();
		$validator = Validator::make($input, $rules);

		if ($validator->passes()) {
			$user = new User();
			$user->fill($input);
			$user->password = Hash::make($input['password']);
			// $user->save();
			return Redirect::to('login')
				->with('message', 'Het account is succesvol geregistreerd, log hieronder in om verder te gaan!')
				->with('email', $user->email);
		} else {
			return Redirect::to('register')->withErrors($validator)->withInput();
		}
	}

}