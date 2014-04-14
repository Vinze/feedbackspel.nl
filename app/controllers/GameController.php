<?php
class GameController extends BaseController {

	// private $url = 'http://'.Request::server('SERVER_NAME').':3000';

	public function getHost($room) {
		$data = $this->encrypt('host', $room);
		$socket_url = 'http://'.Request::server('SERVER_NAME').':3000?d=' . $data;

		return View::make('game.host', compact('socket_url'));
	}

	public function getClient($room) {
		$data = $this->encrypt('client', $room);
		$socket_url = 'http://'.Request::server('SERVER_NAME').':3000?d=' . $data;

		return View::make('game.client', compact('socket_url'));

		// $token = str_random(32);
		// $user = Auth::user();
		// $user->token = $token;
		// $user->room = ($room) ? $room : randomStr(6);
		// $user->save();
		
		// $url = 'http://' . Request::server('SERVER_NAME') . ':3000';

		// $url_params = '?token=' . $token;
		
		// return View::make('pages.game', compact('user', 'url', 'url_params'));
	}

	private function encrypt($type, $room) {
		$token = str_random(32);
		
		$user = Auth::user();
		$user->token = $token;
		$user->save();

		return base64_encode($type.'/'.$token.'/'.$room);
	}

}