@extends('layout.base')
@section('content')
	{{ nprint($users->toArray()) }}
@stop