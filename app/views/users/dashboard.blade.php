@extends('layout.base')
@section('content')
	<div class="row">
		<div class="col span-12">
			<h1>Dashboard</h1>

			<a href="{{ url('game') }}" class="btn-confirm"><i class="fa fa-fw fa-gamepad"></i> Nieuw spel</a>
		</div>
	</div>
@stop