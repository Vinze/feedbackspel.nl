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
	<link rel="stylesheet" href="{{ url('css/stylesheet.css') }}">
	@yield('head')
</head>
<body>
	
	<div class="header-wrapper">
		<div class="container">
			<div class="header row">
				<a href="{{ url('/') }}" class="logo">
					<img src="{{ url('images/logo.png') }}">
				</a>
				<!-- <ul class="nav">
					@if (Auth::check())
						<li><a href="{{ url('dashboard') }}"><i class="fa fa-fw fa-home"></i> Dashboard</a></li>
						<li><a href="{{ url('profile') }}"><i class="fa fa-fw fa-user"></i> Profiel</a></li>
						<li><a href="{{ url('logout') }}"><i class="fa fa-fw fa-sign-out"></i> Uitloggen</a></li>
					@else
						<li><a href="{{ url('login') }}"><i class="fa fa-fw fa-sign-in"></i> Inloggen</a></li>
					@endif
				</ul> -->
				<button class="nav-toggle"><i class="fa fa-bars"></i></button>
				<nav class="nav-collapse">
					<ul>
						<li><a href="#"><i class="fa fa-fw fa-home"></i> Dashboard</a></li>
						<li><a href="#"><i class="fa fa-fw fa-user"></i> Profiel</a></li>
						<li><a href="#"><i class="fa fa-fw fa-sign-out"></i> Uitloggen</a></li>
					</ul>
				</nav>
			</div>
		</div>
	</div>
	<div class="content-wrapper">
		<div class="container">
			<div class="content">
				@yield('content')
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
	
	{{ HTML::script('js/libs/responsive-nav.min.js') }}

	<script type="text/javascript">
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-49342046-1', 'feedbackspel.nl');
		ga('send', 'pageview');

		var app_url = "{{ url('/') }}";
		var base_url = "http://{{ Request::server('SERVER_NAME') }}";
		var token = "{{ isset($token) ? $token : null }}";

		var navigation = responsiveNav('.nav-collapse', {
			customToggle: '.nav-toggle'
		});
	</script>
	@yield('scripts')
</body>	
</html>