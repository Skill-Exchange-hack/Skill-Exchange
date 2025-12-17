<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserSkill;
use App\Models\DesiredSkill;
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

    // マッチングユーザーを取得（自分の欲しいスキルと相手の持っているスキルが一致）
    public function getMatchingUsers(Request $request)
    {
        try {
            $userId = $request->query('user_id');
            
            if (!$userId) {
                return response()->json(['error' => 'user_id is required'], 400);
            }

            // 現在のユーザーの欲しいスキル一覧を取得
            $currentUserDesiredSkills = DesiredSkill::where('user_id', $userId)
                ->pluck('skill_id')
                ->toArray();

            // 現在のユーザー以外の全ユーザーを取得
            $otherUsers = User::where('id', '!=', $userId)->get();

            $matchingUsers = [];

            foreach ($otherUsers as $user) {
                // このユーザーの持っているスキル一覧を取得
                $userSkills = UserSkill::where('user_id', $user->id)
                    ->pluck('skill_id')
                    ->toArray();

                // 欲しいスキルと持っているスキルが一致しているか確認
                $hasMatch = false;
                foreach ($currentUserDesiredSkills as $desiredSkillId) {
                    if (in_array($desiredSkillId, $userSkills)) {
                        $hasMatch = true;
                        break;
                    }
                }

                // マッチしたユーザーのみを含める
                if ($hasMatch) {
                    $matchingUsers[] = $user;
                }
            }

            return response()->json($matchingUsers);
        } catch (\Exception $e) {
            Log::error('Error in getMatchingUsers:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // より詳細なマッチング情報を取得（スキルの一致情報を含む）
    public function getMatchingUsersWithDetails(Request $request)
    {
        try {
            $userId = $request->query('user_id');
            
            if (!$userId) {
                return response()->json(['error' => 'user_id is required'], 400);
            }

            // 現在のユーザーの欲しいスキル一覧を取得
            $currentUserDesiredSkills = DesiredSkill::where('user_id', $userId)
                ->with('skill')
                ->get();

            // 現在のユーザー以外の全ユーザーを取得
            $otherUsers = User::where('id', '!=', $userId)
                ->get();

            $matchingUsers = [];

            foreach ($otherUsers as $user) {
                // このユーザーの持っているスキル一覧を取得
                $userSkills = UserSkill::where('user_id', $user->id)
                    ->with('skill')
                    ->get();

                // 一致するスキルを探す
                $matchedSkills = [];
                foreach ($currentUserDesiredSkills as $desiredSkill) {
                    foreach ($userSkills as $userSkill) {
                        if ($userSkill->skill_id === $desiredSkill->skill_id) {
                            $matchedSkills[] = [
                                'skill_id' => $userSkill->skill_id,
                                'skill_name' => $userSkill->skill->name ?? 'Unknown',
                                'skill_level' => $userSkill->level,
                                'priority' => $desiredSkill->priority,
                            ];
                        }
                    }
                }

                // マッチしたユーザーのみを含める
                if (count($matchedSkills) > 0) {
                    $matchingUsers[] = [
                        'id' => $user->id,
                        'name' => $user->name,
                        'created_at' => $user->created_at,
                        'matched_skills' => $matchedSkills,
                        'match_count' => count($matchedSkills),
                    ];
                }
            }

            return response()->json($matchingUsers);
        } catch (\Exception $e) {
            Log::error('Error in getMatchingUsersWithDetails:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
