<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

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
        // バリデーションなしで name のみを使う
        $user = User::create([
            'name' => $request->name,
        ]);

        return response()->json($user, 201);
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
