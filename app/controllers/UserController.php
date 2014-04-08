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
		// Set the validation rules
		$rules = array(
			'email' => 'required|email',
			'password' => 'required'
		);

		// Get the input and validate it
		$validator = Validator::make(Input::all(), $rules);

		// Check if the validation has passed
		if ($validator->passes()) {
			// Set the auth variables
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
		// Logout the user
		Auth::logout();

		// Redirect to the homepage
		return Redirect::to('/')->with('message', 'Je bent succesvol uitgelogd.');
	}

	/**
	 * Show the dashboard
	 * 
	 * @return object View
	 */
	public function getDashboard() {
		return View::make('users.dashboard');
	}

	/**
	 * Show the user profile
	 * 
	 * @return object View
	 */
	public function getProfile() {
		return View::make('users.profile');
	}

	public function postProfile() {
		nprint(Input::all());
	}

	/**
	 * Register page
	 * 
	 * @return View object
	 */
	public function getRegister() {
		// Check if the user is already logged in
		if (Auth::check()) return Redirect::to('dashboard');

		// Return the register page
		return View::make('users.register');
	}

	/**
	 * Validate and register a new user account
	 * 
	 * @return Redirect object
	 */
	public function postRegister() {
		// Set the validation rules
		$rules = array(
			'email'     => 'required|email',
			'password'  => 'required|same:password2',
			'password2'  => 'required',
			'firstname' => 'required|min:2',
			'lastname'  => 'required|min:2',
			'gender'    => 'required|in:m,f'
		);

		// Get the input and validate it
		$validator = Validator::make(Input::all(), $rules);

		// Check if the validation has passed
		if ($validator->passes()) {
			// Create the new user
			$user = new User();
			$user->fill(Input::all());
			$user->password = Hash::make(Input::get('password'));
			$user->save();

			// Login the new user
			Auth::login($user);

			// Redirect to the dashboard
			return Redirect::to('dashboard')->with('message', 'Je account is succesvol geregistreerd!');
		} else {
			// Validation failed, return to the register page
			return Redirect::to('register')->withErrors($validator)->withInput();
		}
	}

}