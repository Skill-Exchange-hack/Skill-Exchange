<?php

namespace App\Http\Controllers;

use App\Models\UserMatch;
use App\Models\ChatRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserMatchController extends Controller
{
    public function index()
    {
        // チャットメッセージがあるマッチのみを取得
        $matches = UserMatch::with(['chatRoom', 'user1', 'user2', 'skillFromUser1', 'skillFromUser2'])
            ->whereHas('chatRoom.messages')  // チャットメッセージがあるマッチのみ
            ->orderBy('created_at', 'desc')
            ->get();

        $matchesByUser = [];  // ユーザーごとの最新マッチのみを保持

        foreach ($matches as $match) {
            $user1Id = $match->user1_id;
            $user2Id = $match->user2_id;

            // user1が基準の場合、user2との最新マッチのみを保持
            $otherUserId = $user1Id;
            if (!isset($matchesByUser[$otherUserId])) {
                $matchesByUser[$otherUserId] = [
                    'id' => $match->id,
                    'user1_id' => $match->user1_id,
                    'user2_id' => $match->user2_id,
                    'user1' => [
                        'id' => $match->user1->id,
                        'name' => $match->user1->name,
                    ],
                    'user2' => [
                        'id' => $match->user2->id,
                        'name' => $match->user2->name,
                    ],
                    'status' => $match->status,
                    'created_at' => $match->created_at,
                    'chat_room_id' => $match->chatRoom->id ?? null,
                ];
            }
        }

        // 連想配列を通常の配列に変換
        $result = array_values($matchesByUser);
        
        // created_at でソート（最新順）
        usort($result, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        return response()->json($result);
    }

    public function store(Request $request)
    {
        try {
            Log::info('UserMatch store request:', $request->all());

            $validated = $request->validate([
                'user1_id' => 'required|exists:users,id',
                'user2_id' => 'required|exists:users,id',
                'skill_from_user1' => 'required|exists:skills,id',
                'skill_from_user2' => 'required|exists:skills,id',
                'status' => 'nullable|string',
            ]);

            // デフォルトstatus
            if (!isset($validated['status'])) {
                $validated['status'] = 'pending';
            }

            $userMatch = UserMatch::create($validated);
            
            // マッチ作成後、自動的にチャットルームを作成
            $chatRoom = ChatRoom::create(['match_id' => $userMatch->id]);
            Log::info('ChatRoom created with match_id:', ['match_id' => $userMatch->id, 'chat_room_id' => $chatRoom->id]);

            // マッチ情報とチャットルーム情報を一緒に返す
            $userMatch->load('chatRoom', 'user1', 'user2', 'skillFromUser1', 'skillFromUser2');
            
            return response()->json([
                'user_match' => $userMatch,
                'chat_room_id' => $chatRoom->id,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation failed:', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating UserMatch:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(UserMatch $userMatch)
    {
        $userMatch->load('chatRoom', 'user1', 'user2', 'skillFromUser1', 'skillFromUser2');
        return response()->json($userMatch);
    }

    public function update(Request $request, UserMatch $userMatch)
    {
        $validated = $request->validate([
            'status' => 'sometimes|string',
        ]);

        $userMatch->update($validated);
        return response()->json($userMatch);
    }

    public function destroy(UserMatch $userMatch)
    {
        $userMatch->delete();
        return response()->json(['message' => 'UserMatch deleted successfully']);
    }
}
