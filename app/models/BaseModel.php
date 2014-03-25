<?php
class BaseModel extends Eloquent {

	public static function boot() {
		parent::boot();

		static::saving(function($model) {
			
		});

	}

}