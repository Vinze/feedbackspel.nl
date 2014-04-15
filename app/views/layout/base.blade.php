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
	@yield('head')
</head>
<body>
	
	<div class="header-wrapper">
		<div class="container">
			<div class="header row">
				<a href="{{ url('/') }}" class="logo">
					<img src="{{ url('images/logo.png') }}">
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
	
	<script type="text/javascript">
		var base_url = "{{ url('/') }}";
		var socket_url = "{{ isset($socket_url) ? $socket_url : '' }}";
	</script>
	{{ HTML::script('js/libs/jquery.min.js') }}
	{{ HTML::script('js/functions.js') }}
	@yield('scripts')
</body>	
</html>