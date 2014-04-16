@extends('layout.base')
@section('content')
	<div id="content" ng-app="feedbackspel" ng-controller="HostController" ng-cloak class="ng-cloak">
		<h1>Game</h1>
		<div class="row">
			<div class="col span-4">
				<h2>Verbonden</h2>
				<table>
					<tbody>
						<tr ng-repeat="user in users">
							<td><img ng-src="<% base_url + '/avatar/' + user.hash + user.id %>" style="width:32px;"></td>
							<td><% user.firstname %> <% user.lastname %></td>
							<td>
								<i class="fa fa-fw fa-square-o" ng-show="!user.done"></i>
								<i class="fa fa-fw fa-check-square-o" ng-show="user.done"></i>
							</td>
						</tr>
					</tbody>
				</table>

				<p><a href="{{ url('join/'.$room) }}" target="_blank">Join room</a></p>
			</div>
			<div class="col span-8">
				<div class="card">
					<div class="card-title">
						Perfectionist
					</div>
				</div>
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

		$scope.base_url = base_url;
		$scope.users = [];
		
		socket.on('users updated', function(users) {
			$scope.users = users;
		});

		var total_done = 0;
		socket.on('user done', function(user_id) {
			for (var i = 0; i < $scope.users.length; i++) {
				if ($scope.users[i].id == user_id) {
					$scope.users[i].done = true;
					total_done++;
				}
				if (total_done = $scope.users.length) {
					console.log('Everyone is done!');
					break;
				}
			}
		});
	});
	</script>
@stop