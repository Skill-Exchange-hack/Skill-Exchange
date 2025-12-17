<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatRoomController;
use App\Http\Controllers\ChatMessageController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HelloController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\UserSkillController;
use App\Http\Controllers\DesiredSkillController;
use App\Http\Controllers\UserMatchController;

Route::get('/hello', [HelloController::class, 'index']);

// ユーザーのログインエンドポイント
Route::post('/login', [UserController::class, 'login']);

// マッチングエンドポイント
Route::get('/users/matching', [UserController::class, 'getMatchingUsers']);
Route::get('/users/matching-with-details', [UserController::class, 'getMatchingUsersWithDetails']);

// チャットエンドポイント
Route::get('/chat-messages/latest', [ChatMessageController::class, 'getLatest']);

Route::apiResource('users', UserController::class);
Route::apiResource('skills', SkillController::class);
Route::apiResource('user-skills', UserSkillController::class);
Route::apiResource('desired-skills', DesiredSkillController::class);
Route::apiResource('user-matches', UserMatchController::class);
Route::apiResource('chat-rooms', ChatRoomController::class);
Route::apiResource('chat-messages', ChatMessageController::class);
