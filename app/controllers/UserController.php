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

	/**
	 * Update the user profile
	 * 
	 * @return object Redirect
	 */
	public function postProfile() {
		// Set the validation rules
		$rules = array(
			'email'     => 'required|email',
			'firstname' => 'required|min:2',
			'lastname'  => 'required|min:2',
			'gender'    => 'required|in:m,f'
		);

		// Get the input and validate it
		$validator = Validator::make(Input::all(), $rules);

		// Check if the validation has passed
		if ($validator->passes()) {
			// Create the new user
			$user = Auth::user();
			$user->fill(Input::all());
			$user->save();

			// Redirect to the dashboard
			return Redirect::to('profile')->with('message', 'Gegevens zijn succesvol gewijzigd.');
		} else {
			// Validation failed, return to the register page
			return Redirect::to('profile')->withErrors($validator)->withInput();
		}
	}

	/**
	 * Show the user avatar
	 * 
	 * @return string Image
	 */
	public function getAvatar($hashid) {
		$hash = substr($hashid, 0, 8);
		$id = substr($hashid, 8);
		$user = User::where('id', $id)->where('hash', $hash)->first();
		$path = storage_path('avatars/'.$id. '.jpg');
		
		if ($user && file_exists($path)) {
			$image = Image::make($path);
		} else {
			$image = Image::make(storage_path('avatars/placeholder.png'));
		}

		return $image->response();
		
	}

	/**
	 * Update the user avatar
	 * 
	 * @return object Redirect
	 */
	public function postAvatar() {
		$mimes = array('image/png', 'image/jpeg');
		$path  = storage_path('avatars/'.Auth::user()->id. '.jpg');
		$file  = Input::file('avatar');
		
		if ($file && in_array($file->getMimeType(), $mimes)) {
			$image = Image::make($file->getRealPath());
			if ($image->width > $image->height) {
				$image->resize(null, 256, true, true);
				$image->crop(256, 256);
			} else {
				$image->resize(256, null, true, true);
				if ($image->height > (256 + 20)) {
					$image->crop(256, 256, null, 20);
				} else {
					$image->crop(256, 256);
				}
			}
			$image->save($path);
			return Redirect::to('profile')->with('message', 'De afbeelding is succesvol gewijzigd.');
		} else {
			return Redirect::to('profile')->with('error', 'Er is een fout opgetreden bij het wijzigen van de foto!');
		}
	}

	/**
	 * Register page
	 * 
	 * @return object View
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
			$user->hash = strtolower(str_random(8));
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