<?php
function nprint($data) {
	echo '<pre>'.print_r($data, true).'</pre>';	
}

function randomStr($length = 6) {
	$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	$string = '';
	for ($i = 0; $i < $length; $i++) {	
		$string .= $chars[rand(0, strlen($chars)-1)];
	}
	return $string;
}