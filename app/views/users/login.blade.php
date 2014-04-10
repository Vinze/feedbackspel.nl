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
				</div>
			</div>
		</div>

		<div class="content-wrapper">
			<div class="container">
				<div class="content">
					<div class="row">
						<div class="col span-4 offset-4">
							<h1>Inloggen</h1>
							{{ HTML::flash() }}
							{{ Form::open() }}
								<div class="row fg{{ ($errors->has('email') ? ' has-error' : '') }}">
									<div class="col span-12">
										{{ Form::label('email', 'E-mail adres:') }}
										{{ Form::text('email', $email) }}
									</div>
								</div>
								<div class="row fg{{ ($errors->has('password') ? ' has-error' : '') }}">
									<div class="col span-12">
										{{ Form::label('password', 'Wachtwoord:') }}
										{{ Form::password('password') }}
									</div>
								</div>
								<div class="row fg">
									<div class="col span-12">
										<label>{{ Form::checkbox('remember', 1, true) }} Ingelogd blijven</label>
									</div>
								</div>
								<div class="row fg">
									<div class="col span-12">
										<button type="submit" class="btn-confirm">Inloggen</button>
									</div>
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