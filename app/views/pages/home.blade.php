@extends('layout.site')
@section('content')
	
	<div class="header-wrapper">
		<div class="container">
			<div class="header row">
				<div class="col span-12">
					<a href="{{ url('/') }}" class="logo">
						Feedback<span class="grey">spel.nl</span>
					</a>
					<div class="buttons">
						<a href="{{ url('login') }}" class="btn"><i class="fa fa-sign-in"></i> Inloggen</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="banner-wrapper">
		<div class="container">
			<div class="banner row">
				<div class="col span-8 cards">
					<img src="{{ url('images/banner.png') }}">
				</div>
				<div class="col span-4 signup">
					<h1>Registeren</h1>
					{{ Form::open() }}

						<div class="row">
							<div class="col span-12">
								{{ Form::label('email', 'E-mail adres:') }}<br>
								{{ Form::text('email') }}
							</div>
						</div>
						<div class="row">
							<div class="col span-6">
								{{ Form::label('password', 'Wachtwoord:') }}<br>
								{{ Form::password('password') }}
							</div>
							<div class="col span-6">
								{{ Form::label('password_repeat', 'Herhaal wachtwoord:') }}<br>
								{{ Form::password('password_repeat') }}
							</div>
						</div>
						<div class="row">
							<div class="col span-6">
								{{ Form::label('firstname', 'Voornaam:') }}<br>
								{{ Form::text('firstname') }}
							</div>
							<div class="col span-6">
								{{ Form::label('lastname', 'Achternaam:') }}<br>
								{{ Form::text('lastname') }}
							</div>
						</div>
						<div class="row">
							<div class="col span-12">
								Ik ben een: 
								<label>{{ Form::radio('sex', 'male') }} Man</label>
								<label>{{ Form::radio('sex', 'female') }} Vrouw</label>
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

	<div class="page">
		<div class="container">
			<div class="section row">
				<div class="col span-4">
					<h2>Wat is dit?</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, nesciunt impedit dolore similique vel facere tempora! Quasi, sint, sapiente, itaque deleniti placeat debitis labore non unde iure ab cum nobis!</p>
					<p>Quasi, sint, sapiente, itaque deleniti placeat debitis labore.</p>
				</div>
				<div class="col span-4">
					<h2>Voor wie?</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, nesciunt impedit dolore similique vel facere tempora! Quasi, sint, sapiente, itaque deleniti placeat debitis labore non unde iure ab cum nobis!
						<ul>
							<li>Lorem ipsum dolar sit..</li>
							<li>Lorem ipsum dolar sit..</li>
							<li>Lorem ipsum dolar sit..</li>
						</ul>
					</p>
				</div>
				<div class="col span-4">
					<h2>Waarom?</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, nesciunt impedit dolore similique vel facere tempora! Quasi, sint, sapiente, itaque deleniti placeat debitis labore non unde iure ab cum <a href="#">nobis</a>!</p>
				</div>
			</div>
		</div>
	</div>

	<div class="footer-wrapper">
		<div class="container">
			<div class="footer row">

				<div class="col span-12 align-center">
					<p>&copy; {{ date('Y') }} Feedbackspel.nl - <a href="http://www.vbremer.nl/" target="_blank">Vincent Bremer</a></p>
					<p id="clients"></p>
				</div>
				
			</div>
		</div>
	</div>

@stop
@section('scripts')
	
	{{ HTML::script('http://feedbackspel.nl:3000/socket.io/socket.io.js') }}
	<script type="text/javascript">

		var socket = io.connect('http://feedbackspel.nl:3000');

		socket.on('clients_update', function(clients) {
			if (clients == 1) {
				document.getElementById('clients').innerHTML = 'Momenteel is ' + clients + ' iemand online.';
			} else {
				document.getElementById('clients').innerHTML = 'Momenteel zijn ' + clients + ' mensen online.';
			}
			console.log(clients);			
		});
	</script>
@stop