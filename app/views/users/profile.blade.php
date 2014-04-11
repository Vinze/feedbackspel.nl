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
					<ul class="nav">
						<li><a href="{{ url('dashboard') }}"><i class="fa fa-fw fa-home"></i> Dashboard</a></li>
						<li><a href="{{ url('profile') }}"><i class="fa fa-fw fa-user"></i> Profiel</a></li>
						<li><a href="{{ url('logout') }}"><i class="fa fa-fw fa-sign-out"></i> Uitloggen</a></li>
					</ul>
				</div>
			</div>
		</div>
		<div class="content-wrapper">
			<div class="container">
				<div class="content">
					<h1>Mijn profiel</h1>
					{{ HTML::flash() }}
					<div class="section row">
						<div class="col span-8">
							<h2>Gegevens</h2>
							{{ Form::model(Auth::user()) }}
								<div class="row fg{{ ($errors->has('email') ? ' has-error' : '') }}">
									<div class="col span-4">{{ Form::label('email', 'E-mail adres:') }}</div>
									<div class="col span-6">
										{{ Form::text('email') }}
										<span class="required"></span>
									</div>
								</div>
								<div class="row fg{{ ($errors->has('firstname') ? ' has-error' : '') }}">
									<div class="col span-4">{{ Form::label('firstname', 'Voornaam:') }}</div>
									<div class="col span-6">
										{{ Form::text('firstname') }}
										<span class="required"></span>
									</div>
								</div>
								<div class="row fg{{ ($errors->has('lastname') ? ' has-error' : '') }}">
									<div class="col span-4">{{ Form::label('lastname', 'Achternaam:') }}</div>
									<div class="col span-6">
										{{ Form::text('lastname') }}
										<span class="required"></span>
									</div>
								</div>
								<div class="row fg{{ ($errors->has('gender') ? ' has-error' : '') }}">
									<div class="col span-4">{{ Form::label(null, 'Ik ben een:') }}</div>
									<div class="col span-6">
										<label>{{ Form::radio('gender', 'm', true) }} Man</label>
										<label>{{ Form::radio('gender', 'f') }} Vrouw</label>
									</div>
								</div>
								<div class="row fg">
									<button type="submit" class="btn-confirm"><i class="fa fa-save"></i> Opslaan</button>
								</div>
							{{ Form::close() }}
						</div>
						<div class="col span-4 avatar-select">
							<img src="{{ url('avatar/'.Auth::user()->hash) }}" class="avatar">
							{{ Form::open(array('url' => 'avatar', 'files' => true, 'id' => 'upload-form')) }}
								<button class="btn-confirm file-upload" type="submit">
									{{ Form::file('avatar') }}
									<i class="fa fa-picture-o"></i> Wijzig foto..
								</button>
							{{ Form::close() }}
						</div>
					</div>
					<div class="section row">
						<div class="col span-8">
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
									<button type="submit" class="btn-confirm"><i class="fa fa-save"></i> Opslaan</button>
								</div>
							{{ Form::close() }}
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

		{{ HTML::script('js/libs/jquery.min.js') }}
		
		<script type="text/javascript">
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-49342046-1', 'feedbackspel.nl');
			ga('send', 'pageview');

			$(function() {
				$('#upload-form input').on('change', function(e) {
					e.preventDefault();
					$('#upload-form').submit();
				});
			});
		</script>
	</body>	
</html>