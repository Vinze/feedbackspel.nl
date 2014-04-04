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

Route::get('register', function() {
	return View::make('users.register');
});

// Route::get('login', 'UserController@getLogin');
// Route::post('login', 'UserController@postLogin');

// Route::group(array('before' => 'csrf'), function() {
// 	Route::post('register', 'UserController@postRegister');
// });

// Route::group(array('before' => 'auth'), function() {
// 	Route::get('dashboard', function() {
// 		return View::make('users.dashboard');
// 	});
// 	Route::get('logout', 'UserController@getLogout');
// });


App::missing(function($exception) {
	return Response::view('layout.404', array(), 404);
});