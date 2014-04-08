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
	</head>
	<body>
		
		<div class="header-wrapper">
			<div class="container">
				<div class="header row">
					<a href="{{ url('/') }}" class="logo">
						<img src="images/logo.png">
					</a>
					@if (Auth::check())
						<a href="{{ url('dashboard') }}" class="btn-confirm btn-large"><i class="fa fa-home"></i> Dashboard</a>
						<a href="{{ url('dashboard') }}" class="btn-confirm btn-small"><i class="fa fa-home"></i></a>
					@else
						<a href="{{ url('login') }}" class="btn-confirm btn-large"><i class="fa fa-sign-in"></i> Inloggen</a>
						<a href="{{ url('login') }}" class="btn-confirm btn-small"><i class="fa fa-sign-in"></i></a>
					@endif
				</div>
			</div>
		</div>

		<div class="banner-wrapper">
			<div class="container">
				<div class="banner row">
					
				</div>
			</div>
		</div>

		<div class="content-wrapper">
			<div class="container">
				<div class="content">
					<h1>Mijn profiel</h1>
					<div class="row">
						<div class="col span-6">
							<h2>Gegevens</h2>
							{{ Form::model(Auth::user()) }}
								<div class="row fg">
									<div class="col span-4">{{ Form::label('email', 'E-mail adres:') }}</div>
									<div class="col span-6">{{ Form::text('email') }}</div>
								</div>
								<div class="row fg">
									<div class="col span-4">{{ Form::label('firstname', 'Voornaam:') }}</div>
									<div class="col span-6">{{ Form::text('firstname') }}</div>
								</div>
								<div class="row fg">
									<div class="col span-4">{{ Form::label('lastname', 'Achternaam:') }}</div>
									<div class="col span-6">{{ Form::text('lastname') }}</div>
								</div>
								<div class="row fg{{ ($errors->has('gender') ? ' has-error' : '') }}">
									<div class="col span-4">{{ Form::label(null, 'Ik ben een:') }}</div>
									<div class="col span-6">
										<label>{{ Form::radio('gender', 'm', true) }} Man</label>
										<label>{{ Form::radio('gender', 'f') }} Vrouw</label>
									</div>
								</div>
								<div class="row fg">
									<button type="submit" class="btn-confirm">Gegevens bijwerken</button>
								</div>
							{{ Form::close() }}
						</div>
						<div class="col span-6">
							<h2>Wijzig wachtwoord</h2>
							{{ Form::open(array('url' => 'change-password')) }}
								<div class="row fg">
									<div class="col span-4">{{ Form::label('password', 'Huidig wachtwoord:') }}</div>
									<div class="col span-6">{{ Form::text('password') }}</div>
								</div>
								<div class="row fg">
									<div class="col span-4">{{ Form::label('new_password', 'Nieuw wachtwoord:') }}</div>
									<div class="col span-6">{{ Form::text('new_password') }}</div>
								</div>
								<div class="row fg">
									<div class="col span-4">{{ Form::label('new_password2', 'Herhaal wachtwoord:') }}</div>
									<div class="col span-6">{{ Form::text('new_password2') }}</div>
								</div>
								<div class="row fg">
									<button type="submit" class="btn-confirm">Wachtwoord wijzigen</button>
								</div>
							{{ Form::close() }}
						</div>
					</div>
					<div class="row">
						<div class="col span-12">
							<h2>Profielfoto</h2>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="footer-wrapper">
			<div class="container">
				<div class="footer row">
					<div class="grid-12 align-center">
						&copy; 2014 Feedbackspel.nl - Vincent Bremer
					</div>
				</div>
			</div>
		</div>
		
		<script type="text/javascript">
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-49342046-1', 'feedbackspel.nl');
			ga('send', 'pageview');
		</script>
	</body>	
</html>