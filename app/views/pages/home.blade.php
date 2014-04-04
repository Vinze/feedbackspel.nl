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
					<a href="{{ url('login') }}" class="btn-confirm btn-large"><i class="fa fa-sign-in"></i> Inloggen</a>
					<a href="{{ url('login') }}" class="btn-confirm btn-small"><i class="fa fa-sign-in"></i></a>
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
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-49342046-1', 'feedbackspel.nl');
			ga('send', 'pageview');
		</script>
	</body>	
</html>