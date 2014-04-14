@extends('layout.base')
@section('content')
	<div id="content" ng-app="feedbackspel" ng-controller="HostController" ng-cloak class="ng-cloak">
		<h1>Game</h1>
		<div class="row">
			<div class="col span-6">
				<h2>Verbonden</h2>
				<p class="user" ng-repeat="user in users">
					<img ng-src="<% base_url + '/avatar/' + user.hash + user.id %>" style="width:32px;">
					<% user.firstname %>
					<% user.lastname %>
				</p>
			</div>
			<div class="col span-6">
				<h2>Berichten</h2>
				<p class="message" ng-repeat="message in messages">
					<% message %>
				</p>
			</div>
		</div>
	</div>
@stop
@section('scripts')

	{{ HTML::script('http://'.Request::server('SERVER_NAME').':3000/socket.io/socket.io.js') }}
	{{ HTML::script('https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.5/angular.min.js') }}
	{{ HTML::script('js/game.js') }}

	<script type="text/javascript">
	app.controller('HostController', function($scope, socket) {

		$scope.messages = [];
		$scope.users = [];
		$scope.base_url = base_url;

		socket.on('message', function(message) {
			$scope.messages.push(message);
		});

		socket.on('users updated', function(users) {
			$scope.users = users;
		});
	});
	</script>
@stop