@extends('layout.base')
@section('content')
	<div id="content" ng-app="feedbackspel" ng-controller="ClientController" ng-cloak class="ng-cloak">
		<form ng-submit="addMessage()">
			<div class="row">
				<div class="col span-2"><label for="message">Bericht:</label></div>
				<div class="col span-4"><input type="text" id="message" ng-model="message"></div>
			</div>
		</form>
	</div>
@stop
@section('scripts')

	{{ HTML::script('http://'.Request::server('SERVER_NAME').':3000/socket.io/socket.io.js') }}
	{{ HTML::script('https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.5/angular.min.js') }}
	{{ HTML::script('js/game.js') }}

	<script type="text/javascript">
	app.controller('ClientController', function($scope, socket) {

		$scope.addMessage = function() {
			socket.emit('message', $scope.message);
			$scope.message = '';
		}
	});
	</script>
@stop