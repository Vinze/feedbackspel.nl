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
		
		
		<script type="text/javascript">
			var base_url = '{{ url('/') }}';
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-49342046-1', 'feedbackspel.nl');
			ga('send', 'pageview');
		</script>
	</body>	
</html>