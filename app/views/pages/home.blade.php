<!doctype html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Feedbackspel.nl</title>
	<link rel="shortcut icon" href="{{ url('favicon.ico') }}">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<meta name="keywords" content="feedbackspel feedback spel online game reflectie team samenwerken">
	<link href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet" type="text/css">
	<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
	<link rel="stylesheet" href="{{ url('css/stylesheet.css') }}">
</head>
<body>
	<div class="header-wrapper">
		<div class="container">
			<div class="header row">
				<a href="{{ url('/') }}" class="logo">
					<img src="images/logo.png">
				</a>
				<button class="nav-toggle"><i class="fa fa-bars"></i></button>
				<ul class="nav">
					@if (Auth::check())
						<li><a href="{{ url('dashboard') }}"><i class="fa fa-fw fa-home"></i> Dashboard</a></li>
						<li><a href="{{ url('profile') }}"><i class="fa fa-fw fa-user"></i> Profiel</a></li>
						<li><a href="{{ url('logout') }}"><i class="fa fa-fw fa-sign-out"></i> Uitloggen</a></li>
					@else
						<li><a href="{{ url('login') }}"><i class="fa fa-fw fa-sign-in"></i> Inloggen</a></li>
					@endif
				</ul>
			</div>
		</div>
	</div>

	<div class="banner-wrapper">
		<div class="container">
			<div class="banner row">
				<div class="col span-12 align-center">
					<img src="images/banner.png" class="banner-image">
				</div>
			</div>
		</div>
	</div>

	<div class="content-wrapper">
		<div class="container">
			<div class="content">
				<div class="row">
					<div class="col span-4">
						<h2>Wat is dit?</h2>
						<p>Op deze website kun je, na het registreren van een gratis account, een online feedbackspel spelen. Dit spel maakt het leuker en makkelijker om feedback te geven en ontvangen in groepsverband.</p>
						<p>De ontvangen feedback wordt automatisch opgeslagen in je persoonlijke profiel, en kun je later op ieder moment weer opvragen.</p>
					</div>
					<div class="col span-4">
						<h2>Voor wie?</h2>
						<p>Het spel is bedoeld voor iedereen die geregeld samenwerkt in een team en graag wil weten hoe anderen over je denken. Je zou het feedbackspel bijvoorbeeld kunnen spelen met:</p>
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
						<p>De ontvangen feedback bied een uitstekende basis om op te reflecteren en nieuwe (leer-)doelen op te stellen. Door geregeld feedback sessies te houden zal de samenwerking verbeteren en komen eventuele knelpunten snel boven water.</p>
					</div>
				</div>
				<div class="row">
					<div class="col span-6">
						<h2>Wanneer komt spel online?</h2>
						<p>Dit feedbackspel is mijn afstudeerproject waarmee ik wil afstuderen van de opleiding Communication &amp; Multimedia Design aan de NHL Hogeschool. Het afstuderen is momenteel in volle gang en ik hoop binnenkort een eerste versie uit te kunnen brengen!</p>
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
		var base_url = "{{ url('/') }}";
		var socket_url = "{{ isset($socket_url) ? $socket_url : '' }}";
	</script>
	{{ HTML::script('js/libs/jquery.min.js') }}
	{{ HTML::script('js/functions.js') }}
</body>	
</html>