@extends('layout.base')
@section('content')
	<div class="row">
		<div class="col span-8 offset-2">
			<h1>Registeren</h1>
			{{ HTML::flash() }}
			{{ Form::open() }}
				<div class="row fg{{ ($errors->has('email') ? ' has-error' : '') }}">
					<div class="col span-4">{{ Form::label('email', 'E-mail adres:') }}</div>
					<div class="col span-6">
						{{ Form::text('email') }}
						<div class="required"></div>
					</div>
				</div>
				<div class="row fg{{ ($errors->has('password') ? ' has-error' : '') }}">
					<div class="col span-4">{{ Form::label('password', 'Wachtwoord:') }}</div>
					<div class="col span-6">
						{{ Form::password('password') }}
						<div class="required"></div>
					</div>
				</div>
				<div class="row fg{{ ($errors->has('password2') ? ' has-error' : '') }}">
					<div class="col span-4">{{ Form::label('password2', 'Herhaal wachtwoord:') }}</div>
					<div class="col span-6">
						{{ Form::password('password2') }}
						<div class="required"></div>
					</div>
				</div>
				<div class="row fg{{ ($errors->has('firstname') ? ' has-error' : '') }}">
					<div class="col span-4">{{ Form::label('firstname', 'Voornaam:') }}</div>
					<div class="col span-6">
						{{ Form::text('firstname') }}
						<div class="required"></div>
					</div>
				</div>
				<div class="row fg{{ ($errors->has('lastname') ? ' has-error' : '') }}">
					<div class="col span-4">{{ Form::label('lastname', 'Achternaam:') }}</div>
					<div class="col span-6">
						{{ Form::text('lastname') }}
						<div class="required"></div>
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
					<div class="col span-6 offset-4">
						<button type="submit" class="btn-confirm">Registeren</button>
					</div>
				</div>
			{{ Form::close() }}
		</div>
	</div>
@stop