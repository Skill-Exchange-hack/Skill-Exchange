<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HelloController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\UserSkillController;
use App\Http\Controllers\DesiredSkillController;
use App\Http\Controllers\UserMatchController;

Route::get('/hello', [HelloController::class, 'index']);

// ユーザーのログインエンドポイント
Route::post('/login', [UserController::class, 'login']);

Route::apiResource('users', UserController::class);
Route::apiResource('skills', SkillController::class);
Route::apiResource('user-skills', UserSkillController::class);
Route::apiResource('desired-skills', DesiredSkillController::class);
Route::apiResource('user-matches', UserMatchController::class);
