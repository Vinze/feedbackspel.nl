<!doctype html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Feedbackspel.nl</title>
		<link rel="shortcut icon" href="{{ url('favicon.png') }}">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="keywords" content="feedbackspel feedback spel online game reflectie team samenwerken">
		{{ HTML::style('css/font-awesome.min.css') }}
		{{ HTML::style('css/base.css') }}
		{{ HTML::style('css/site.css') }}
		@yield('head')
	</head>
	<body>
		<div class="header-wrapper">
			<div class="header container">
				<div class="row">
					<div class="col span-12">
						<a href="{{ url('/') }}">
							<img src="{{ url('images/logo.png') }}" class="logo">
						</a>
						@if (Auth::check())
							<a href="{{ url('dashboard') }}" class="btn"><i class="fa fa-home"></i> Dashboard</a>
						@else
							<a href="{{ url('login') }}" class="btn"><i class="fa fa-sign-in"></i> Inloggen</a>
						@endif
					</div>
				</div>
			</div>
		</div>

		<div class="banner-wrapper">
			<div class="banner container">
				{{ HTML::flash() }}
				<div class="row">
					<div class="col span-8 cards">
						<img src="{{ url('images/banner.png') }}">
					</div>
					<div class="col span-4 signup">
						<h1>Registeren</h1>
						{{ Form::open(array('url' => 'register')) }}
							<div class="row">
								<div class="col span-12{{ ($errors->has('email') ? ' has-error' : '') }}">
									{{ Form::label('email', 'E-mail adres:') }}<br>
									{{ Form::text('email') }}
								</div>
							</div>
							<div class="row">
								<div class="col span-12{{ ($errors->has('password') ? ' has-error' : '') }}">
									{{ Form::label('password', 'Wachtwoord:') }}<br>
									{{ Form::password('password') }}
								</div>
							</div>
							<div class="row">
								<div class="col span-12{{ ($errors->has('password_repeat') ? ' has-error' : '') }}">
									{{ Form::label('password_repeat', 'Herhaal wachtwoord:') }}<br>
									{{ Form::password('password_repeat') }}
								</div>
							</div>
							<div class="row">
								<div class="col span-6{{ ($errors->has('firstname') ? ' has-error' : '') }}">
									{{ Form::label('firstname', 'Voornaam:') }}<br>
									{{ Form::text('firstname') }}
								</div>
								<div class="col span-6{{ ($errors->has('lastname') ? ' has-error' : '') }}">
									{{ Form::label('lastname', 'Achternaam:') }}<br>
									{{ Form::text('lastname') }}
								</div>
							</div>
							<div class="row">
								<div class="col span-12{{ ($errors->has('gender') ? ' has-error' : '') }}">
									Ik ben een: 
									<label>{{ Form::radio('gender', 'male', true) }} Man</label>
									<label>{{ Form::radio('gender', 'female') }} Vrouw</label>
								</div>
							</div>
							<div class="row">
								<div class="col span-12 align-right">
									{{ Form::save('<i class="fa fa-user"></i> Registreer') }}
								</div>
							</div>
						{{ Form::close() }}
					</div>
				</div>
			</div>
		</div>

		<div class="content-wrapper">
			<div class="content container">
				<div class="row">
					<div class="col span-4">
						<h2>Wat is dit?</h2>
						<p>Op deze website kun je na het registreren van een (gratis!) account een online spel spelen welke het makkelijker maakt om feedback te geven en ontvangen in groepsverband.</p>
						<p>Deze feedback wordt automatisch opgeslagen en bied waardevolle informatie over hoe mensen over jou denken. Zo krijg je inzicht in je goede eigenschappen, maar ook op welke punten je je nog beter kan ontwikkelen.</p>
					</div>
					<div class="col span-4">
						<h2>Voor wie?</h2>
						<p>Het spel is bedoeld voor iedereen die weleens samenwerkt in een team van 3 tot ongeveer 8 personen. Je zou het feedbackspel bijvoorbeeld kunnen spelen met:</p>
						<ul>
							<li>Collega's</li>
							<li>Medestudenten</li>
							<li>Familieleden</li>
							<li>Vrienden</li>
						</ul>
					</div>
					<div class="col span-4">
						<h2>Waarom?</h2>
						<p>Het geven en ontvangen van feedback kan ontzettend waardevolle informatie opleveren. Hoe denken anderen over je? Wat zijn je positieve eigenschappen? Waar kan je nog aan werken? Door het spelen van dit spel wordt het makkelijker en leuker om een feedback sessie te organiseren.</p>
						<p>De ontvangen feedback is op ieder moment terug te vinden in je persoonlijke profiel, en bied een uitstekende basis om nieuwe (leer-)doelen op te stellen!</p>
					</div>
				</div>
			</div>
		</div>

		<div class="footer-wrapper">
			<div class="footer container">
				<div class="row">

					<div class="col span-12 align-center">
						<p>&copy; {{ date('Y') }} Feedbackspel.nl - <a href="http://www.vbremer.nl/" target="_blank">Vincent Bremer</a></p>
						<p id="clients">Er is momenteel niemand online.</p>
					</div>
					
				</div>
			</div>
		</div>
		
		{{ HTML::script('js/libs/jquery-1.11.0.min.js') }}
		{{ HTML::script($domain.'/socket.io/socket.io.js') }}
		<script type="text/javascript">
			var base_url = '{{ url('/') }}';

			$('form').on('submit', function(e) {
				// e.preventDefault();
			});
			
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-49342046-1', 'feedbackspel.nl');
			ga('send', 'pageview');
			
			var socket = io.connect('{{ $domain }}');

			socket.on('clients_update', function(clients) {
				if (clients == 1) {
					document.getElementById('clients').innerHTML = 'Momenteel is ' + clients + ' iemand online.';
				} else {
					document.getElementById('clients').innerHTML = 'Momenteel zijn ' + clients + ' mensen online.';
				}
				console.log(clients);			
			});
		</script>
	</body>	
</html>