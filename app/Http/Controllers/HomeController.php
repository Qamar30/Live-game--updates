<?php

namespace App\Http\Controllers;

use App\Game;
use App\Update;
use Pusher\Laravel\PusherManager;
use Illuminate\Http\Request;


class HomeController extends Controller
{
 function index()
    {
        $games = Game::all();
        return view('home', ['games' => $games]);
    }
  function viewGame(int $id)
    {
        $game = Game::find($id);
        $updates = $game->updates;
        return view('game', ['game' => $game, 'updates' => $updates]);
    }
   function startGame()
    {
        $game = Game::create(request()->all());
        return redirect("/games/$game->id");
    }
    function updateGame(int $id, PusherManager $pusher)
    {
        $data = request()->all();
        $data['game_id'] = $id;
        $update = Update::create($data);
        $pusher->trigger("game-updates-$id", 'event', $update, request()->header('x-socket-id'));
        return response()->json($update);
    }
    function updateScore(int $id, PusherManager $pusher)
    {
        $data = request()->all();
        $game = Game::find($id);
        $game->update($data);
        $pusher->trigger("game-updates-$id", 'score', $game, request()->header('x-socket-id'));
        return response()->json();
    }
}