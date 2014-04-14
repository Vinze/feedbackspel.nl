@extends('layout.base')
@section('content')
	<div id="content" ng-app="feedbackspel" ng-controller="HostController" ng-cloak class="ng-cloak">
		<h1>Game</h1>
		<div class="row">
			<div class="col span-6">
				<table>
				<tr>
					<th colspan="3">
						Ingelogd als: {{ Auth::user()->firstname }}				
					</th>
				</tr>
					<tr ng-repeat="user in users">
						<td><img ng-src="<% base_url %>/avatar/<% user.hash + user.id %>" style="width: 32px; height: 32px"></td>
						<td><% user.firstname %> <% user.lastname %></td>
						<td>
							<i class="fa fa-square-o" ng-hide="user.done"></i>
							<i class="fa fa-check-square-o" ng-show="user.done"></i>
						</td>
					</tr>
				</table>
			</div>
			<div class="col span-6">
				
			</div>
		</div>
		
		<p><button class="btn-confirm" ng-click="done()">Klaar!</button></p>
		<p><a href="{{ url('game/'.Auth::user()->room) }}">Join {{ Auth::user()->room }}</a></p>
		
	</div>
@stop
@section('scripts')
	{{ HTML::script('http://'.Request::server('SERVER_NAME').':3000/socket.io/socket.io.js') }}
	{{ HTML::script('https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.5/angular.min.js') }}

	<script type="text/javascript">
	var app = angular.module('feedbackspel', []);

	app.config(function($interpolateProvider) {
		$interpolateProvider.startSymbol('<%');
		$interpolateProvider.endSymbol('%>');
	});

	app.factory('socket', function ($rootScope) {
		var socket = io.connect('http://{{ Request::server('SERVER_NAME') }}:3000?token={{ $token }}');
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

	app.controller('HostController', function($scope, socket) {

	});
	</script>
@stop