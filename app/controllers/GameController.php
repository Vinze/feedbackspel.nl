<?php
class GameController extends BaseController {

	// private $url = 'http://'.Request::server('SERVER_NAME').':3000';

	public function getHost($room) {
		$data = $this->encrypt('host', $room);
		$socket_url = 'http://'.Request::server('SERVER_NAME').':3000?d=' . $data;

		return View::make('game.host', compact('socket_url', 'room'));
	}

	public function getClient($room) {
		$data = $this->encrypt('client', $room);
		$socket_url = 'http://'.Request::server('SERVER_NAME').':3000?d=' . $data;

		return View::make('game.client', compact('socket_url', 'room'));
	}

	private function encrypt($type, $room) {
		$token = str_random(32);
		
		$user = Auth::user();
		$user->token = $token;
		$user->save();

		return base64_encode($type.'/'.$token.'/'.$room);
	}

}