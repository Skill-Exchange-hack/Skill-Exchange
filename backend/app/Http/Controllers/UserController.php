<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    // すべてのユーザーを取得
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // 新しいユーザーを作成
    public function store(Request $request)
    {
        // バリデーション
        $validated = $request->validate([
            'name' => 'required|string|unique:users,name',
        ]);

        $user = User::create($validated);
        return response()->json($user, 201);
    }

    // ユーザーをログイン（name で検索）
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string',
            ]);

            Log::info('Login attempt:', $validated);

            $user = User::where('name', $validated['name'])->first();

            if (!$user) {
                Log::warning('User not found:', $validated);
                return response()->json([
                    'error' => 'ユーザーが見つかりません',
                    'name' => $validated['name'],
                ], 404);
            }

            Log::info('User found:', $user->toArray());
            return response()->json($user, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Login validation failed:', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Login error:', ['message' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // 特定のユーザーを取得
    public function show(User $user)
    {
        return response()->json($user);
    }

    // ユーザー情報を更新
    public function update(Request $request, User $user)
    {
        // name のみ更新可能
        if ($request->has('name')) {
            $user->name = $request->name;
            $user->save();
        }

        return response()->json($user);
    }

    // ユーザーを削除
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
