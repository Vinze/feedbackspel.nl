<!doctype html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Feedbackspel.nl</title>
		<link rel="shortcut icon" href="{{ url('favicon.ico') }}">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		{{ HTML::style('//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css') }}
		{{ HTML::style('css/base.css') }}
		{{ HTML::style('css/site.css') }}
		@yield('head')
	</head>
	<body>

		@yield('content')
		
		<script type="text/javascript">var base_url = '{{ url('/') }}';</script>
	</body>	
</html>