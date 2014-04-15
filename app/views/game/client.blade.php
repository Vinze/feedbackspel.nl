@extends('layout.base')
@section('content')
	<div id="content" ng-app="feedbackspel" ng-controller="ClientController" ng-cloak class="ng-cloak">
		<div class="row">
			<div class="col span-4 offset-4">
				<p ng-repeat="user in users">
					<button ng-click="setFeedback(user)" class="btn-default" style="width:100%">
						<% user.firstname %> <% user.lastname %>
						<i class="fa fa-fw fa-square-o" ng-show="!user.checked"></i>
						<i class="fa fa-fw fa-check-square-o" ng-show="user.checked"></i>
					</button>
				</p>
				<p>
					<button ng-click="sendFeedback()" class="btn-confirm" style="width:100%">Done!</button>
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
	app.controller('ClientController', function($scope, socket) {

		$scope.users = [];
		$scope.feedback = [];

		// Scope functions
		$scope.setFeedback = function(user) {
			if (user.checked) {
				// Remove the feedback
				$scope.users[$scope.users.indexOf(user)].checked = false;
				for (var i = 0; i < $scope.feedback.length; i++) {
					if ($scope.feedback[i].user_id == user.id) {
						$scope.feedback.splice(i, 1);
						break;
					}
				}
			} else {
				// Insert the feedback
				$scope.users[$scope.users.indexOf(user)].checked = true;
				$scope.feedback.push({
					user_id: user.id,
					card: 32,
					feedback: 'Lorem ipsum'
				});
			}
		}

		$scope.sendFeedback = function() {
			socket.emit('feedback', $scope.feedback);
			for (var i = 0; i < $scope.users.length; i++) {
				$scope.users[i].checked = false;
			}
			$scope.feedback = [];
		}

		// Sockets
		socket.on('users updated', function(users) {
			$scope.users = users;
		});

		// Private functions
		function deleteFeedback(user_id) {
			
		}

	});
	</script>
@stop