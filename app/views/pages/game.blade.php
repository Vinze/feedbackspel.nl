<!doctype html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Feedbackspel.nl</title>
		<link rel="shortcut icon" href="favicon.ico">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="keywords" content="feedbackspel feedback spel online game reflectie team samenwerken">
		<link href="http://fonts.googleapis.com/css?family=Poiret+One|Open+Sans:400italic,600italic,400,600" rel="stylesheet" type="text/css">
		<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
		<link rel="stylesheet" href="css/stylesheet.css">

		{{ HTML::script('https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.5/angular.min.js') }}
		{{ HTML::script($url . '/socket.io/socket.io.js') }}
	</head>
	<body ng-app="project">
		
		<div class="header-wrapper">
			<div class="container">
				<div class="header row">
					<a href="{{ url('/') }}" class="logo">
						<img src="images/logo.png">
					</a>
				</div>
			</div>
		</div>

		<div class="content-wrapper">
			<div class="container">
				<div class="content" id="content" ng-controller="GameController">
					<table>
					<tr>
						<th colspan="3">
							Ingelogd als: {{ Auth::user()->firstname }}				
						</th>
					</tr>
						<tr ng-repeat="user in users">
							<td><img ng-src="avatar/<% user.hash + user.id %>" style="width: 32px; height: 32px"></td>
							<td><% user.firstname %> <% user.lastname %></td>
							<td>
								<i class="fa fa-square-o" ng-hide="user.done"></i>
								<i class="fa fa-check-square-o" ng-show="user.done"></i>
							</td>
						</tr>
					</table>
					
					<button class="btn-confirm" ng-click="done()">Klaar!</button>
				</div>
			</div>
		</div>
		
		<script type="text/javascript">
			
			var app = angular.module('project', []);

			app.config(function($interpolateProvider) {
				$interpolateProvider.startSymbol('<%');
				$interpolateProvider.endSymbol('%>');
			});

			app.factory('socket', function ($rootScope) {
				var socket = io.connect('{{ $url . '?token=' . $token }}');
				return {
					on: function (eventName, callback) {
						socket.on(eventName, function () {  
							var args = arguments;
							$rootScope.$apply(function () {
								callback.apply(socket, args);
							});
						});
					},
					emit: function (eventName, data, callback) {
						socket.emit(eventName, data, function () {
							var args = arguments;
							$rootScope.$apply(function () {
								if (callback) {
									callback.apply(socket, args);
								}
							});
						})
					}
				};
			});

			app.controller('GameController', function($scope, socket) {
				$scope.users = [];
				$scope.clicked = 0;

				socket.on('users:updated', function(users) {
					$scope.users = users;
				});

				socket.on('user:done', function(user_id) {
					for (var i = 0; i < $scope.users.length; i++) {
						if ($scope.users[i].id == user_id) {
							$scope.users[i].done = true;
							break;
						}
					}
				});
				
				$scope.done = function() {
					socket.emit('user:done');
				}
			});
		</script>
	</body>	
</html>