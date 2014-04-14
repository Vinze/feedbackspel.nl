@extends('layout.base')
@section('content')
@stop
@section('scripts')
	{{ HTML::script('https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.5/angular.min.js') }}
	{{ HTML::script(url('js/game.js')) }}
	{{ HTML::script('http://'.Request::server('SERVER_NAME').':3000/socket.io/socket.io.js') }}
	{{ HTML::script(url('js/GameController.js')) }}
@stop