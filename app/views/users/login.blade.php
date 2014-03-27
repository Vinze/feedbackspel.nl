<!doctype html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Feedbackspel.nl</title>
		<link rel="shortcut icon" href="{{ url('favicon.png') }}">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		{{ HTML::style('css/font-awesome.min.css') }}
		{{ HTML::style('css/base.css') }}
		{{ HTML::style('css/app.css') }}
		@yield('head')
	</head>
	<body>
		
		<div class="header-wrapper">
			<div class="container">
				<div class="header row">
					<a href="{{ url('/') }}">
						<img src="{{ url('images/logo.png') }}" class="logo">
					</a>
				</div>
			</div>
		</div>

		<div class="login">
			<div class="form">
				<h1>Inloggen</h1>
				{{ HTML::flash() }}
				{{ Form::open() }}
					<div class="fg row">
						<div class="col span-4">
							{{ Form::label('email', 'E-mail adres:') }}
						</div>
						<div class="col span-8">
							{{ Form::text('email', $email) }}
						</div>
					</div>
					<div class="fg row">
						<div class="col span-4">
							{{ Form::label('password', 'Wachtwoord:') }}
						</div>
						<div class="col span-8">
							{{ Form::text('password') }}
						</div>
					</div>
					<div class="fg row">
						<div class="col span-12">
							<label>{{ Form::checkbox('remember_me') }} Ingelogd blijven</label>
						</div>
					</div>
					<div class="fg row">
						<div class="col span-12 align-right">
							{{ Form::save('<i class="fa fa-sign-in"></i> Inloggen') }}
						</div>
					</div>
				{{ Form::close() }}
			</div>
		</div>
	</body>
</html>