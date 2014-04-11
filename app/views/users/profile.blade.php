@extends('layout.base')
@section('content')
	<h1>Mijn profiel</h1>
	{{ HTML::flash() }}
	<div class="section row">
		<div class="col span-8">
			<h2>Gegevens</h2>
			{{ Form::model(Auth::user()) }}
				<div class="row fg{{ ($errors->has('email') ? ' has-error' : '') }}">
					<div class="col span-4">{{ Form::label('email', 'E-mail adres:') }}</div>
					<div class="col span-6">
						{{ Form::text('email') }}
						<span class="required"></span>
					</div>
				</div>
				<div class="row fg{{ ($errors->has('firstname') ? ' has-error' : '') }}">
					<div class="col span-4">{{ Form::label('firstname', 'Voornaam:') }}</div>
					<div class="col span-6">
						{{ Form::text('firstname') }}
						<span class="required"></span>
					</div>
				</div>
				<div class="row fg{{ ($errors->has('lastname') ? ' has-error' : '') }}">
					<div class="col span-4">{{ Form::label('lastname', 'Achternaam:') }}</div>
					<div class="col span-6">
						{{ Form::text('lastname') }}
						<span class="required"></span>
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
					<button type="submit" class="btn-confirm"><i class="fa fa-save"></i> Opslaan</button>
				</div>
			{{ Form::close() }}
		</div>
		<div class="col span-4 avatar-select">
			<img src="{{ url('avatar/'.Auth::user()->hash) }}" class="avatar">
			{{ Form::open(array('url' => 'avatar', 'files' => true, 'id' => 'upload-form')) }}
				<button class="btn-confirm file-upload" type="submit">
					{{ Form::file('avatar') }}
					<i class="fa fa-picture-o"></i> Wijzig foto..
				</button>
			{{ Form::close() }}
		</div>
	</div>
	<div class="section row">
		<div class="col span-8">
			<h2>Wijzig wachtwoord</h2>
			{{ Form::open(array('url' => 'change-password')) }}
				<div class="row fg">
					<div class="col span-4">{{ Form::label('password', 'Huidig wachtwoord:') }}</div>
					<div class="col span-6">{{ Form::text('password') }}</div>
				</div>
				<div class="row fg">
					<div class="col span-4">{{ Form::label('new_password', 'Nieuw wachtwoord:') }}</div>
					<div class="col span-6">{{ Form::text('new_password') }}</div>
				</div>
				<div class="row fg">
					<div class="col span-4">{{ Form::label('new_password2', 'Herhaal wachtwoord:') }}</div>
					<div class="col span-6">{{ Form::text('new_password2') }}</div>
				</div>
				<div class="row fg">
					<button type="submit" class="btn-confirm"><i class="fa fa-save"></i> Opslaan</button>
				</div>
			{{ Form::close() }}
		</div>
	</div>
@stop
@section('scripts')
	<script type="text/javascript">
	$(function() {
		$('#upload-form input').on('change', function(e) {
			e.preventDefault();
			$('#upload-form').submit();
		});
	});
	</script>
@stop