<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function() {
	$domain = 'http://'.Request::server('HTTP_HOST').':3000';
	return View::make('pages.home');
});

Route::get('login', 'UserController@getLogin');
Route::get('register', 'UserController@getRegister');

Route::group(array('before' => 'csrf'), function() {
	Route::post('register', 'UserController@postRegister');
	Route::post('login', 'UserController@postLogin');
});

Route::group(array('before' => 'auth'), function() {
	Route::get('dashboard', 'UserController@getDashboard');

	Route::get('profile', 'UserController@getProfile');
	Route::post('profile', 'UserController@postProfile');

	Route::post('change-password', 'UserController@getChangePassword');

	Route::get('avatar/{hash}', 'UserController@getAvatar');
	Route::post('avatar', 'UserController@postAvatar');

	Route::group(array('before' => 'isadmin'), function() {
		Route::get('users', 'UserController@getIndex');
	});

	Route::get('logout', 'UserController@getLogout');

	Route::get('game', function() {
		$token = str_random(32);
		$user = Auth::user();
		$user->game_token = $token;
		$user->save();

		$url = 'http://' . Request::server('SERVER_NAME') . ':3000';
		
		return View::make('pages.game', compact('url', 'token'));
	});
});

App::missing(function($exception) {
	return Response::view('layout.404', array(), 404);
});