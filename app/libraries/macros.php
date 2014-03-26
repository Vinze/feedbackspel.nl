<?php
HTML::macro('flash', function() {
	if (Session::has('error')) {
		$message = Session::get('error');
		return '<div class="flash-error">'.$message.'</div>';
	}
	if (Session::has('message')) {
		$message = Session::get('message');
		return '<div class="flash-success">'.$message.'</div>';
	}
	if (Session::has('errors')) {
		return '<div class="flash-error">Niet alle verplichte velden zijn ingevuld.</div>';
	}
});

Form::macro('save', function($label = 'Opslaan') {
	$options = array(
		'type' => 'submit',
		'class' => 'btn'
	);
	return '<button '.HTML::attributes($options).'>'.$label.'</button>';
});

Form::macro('cb', function($name, $value = 1, $checked = false, $attr = array()) {
	$attr['id'] = $name;
	$html = Form::hidden($name, 0) . Form::checkbox($name, $value, $checked, $attr);
	return $html;
});