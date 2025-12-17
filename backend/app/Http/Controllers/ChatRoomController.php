<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use App\Models\UserMatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatRoomController extends Controller
{
    // ユーザーのチャットルーム一覧を取得
    public function index(Request $request)
    {
        try {
            $userId = $request->query('user_id');
            
            if (!$userId) {
                return response()->json(['error' => 'user_id is required'], 400);
            }

            // このユーザーが関連するマッチを取得
            $matches = UserMatch::where('user1_id', $userId)
                ->orWhere('user2_id', $userId)
                ->with(['chatRoom', 'user1', 'user2', 'skillFromUser1', 'skillFromUser2'])
                ->orderBy('created_at', 'desc')
                ->get();

            $chatRoomsByUser = [];  // ユーザーごとの最新チャットルームのみを保持
            
            foreach ($matches as $match) {
                if ($match->chatRoom) {
                    $otherUserId = $match->user1_id === $userId ? $match->user2_id : $match->user1_id;
                    $otherUser = $match->user1_id === $userId ? $match->user2 : $match->user1;

                    // 同じユーザーとのチャットルームがまだ保存されていない場合のみ追加
                    if (!isset($chatRoomsByUser[$otherUserId])) {
                        $chatRoomsByUser[$otherUserId] = [
                            'id' => $match->chatRoom->id,
                            'match_id' => $match->id,
                            'other_user' => [
                                'id' => $otherUser->id,
                                'name' => $otherUser->name,
                            ],
                            'skill_exchange' => [
                                'user1_skill' => $match->skillFromUser1->name,
                                'user2_skill' => $match->skillFromUser2->name,
                            ],
                            'created_at' => $match->chatRoom->created_at,
                        ];
                    }
                }
            }

            // 連想配列を通常の配列に変換
            $chatRooms = array_values($chatRoomsByUser);
            
            // created_at でソート（最新順）
            usort($chatRooms, function($a, $b) {
                return strtotime($b['created_at']) - strtotime($a['created_at']);
            });

            return response()->json($chatRooms);
        } catch (\Exception $e) {
            Log::error('Error in ChatRoomController@index:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // チャットルームを作成（マッチからチャットルームへ）
    public function store(Request $request)
    {
        try {
            Log::info('ChatRoom store request:', $request->all());

            $validated = $request->validate([
                'match_id' => 'required|integer|exists:matches,id',
            ]);

            // 既に存在するチャットルームがあるか確認
            $existingChatRoom = ChatRoom::where('match_id', $validated['match_id'])->first();
            if ($existingChatRoom) {
                return response()->json(['message' => 'Chat room already exists', 'chat_room' => $existingChatRoom], 200);
            }

            $chatRoom = ChatRoom::create($validated);
            Log::info('ChatRoom created:', $chatRoom->toArray());
            return response()->json($chatRoom, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation failed:', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating ChatRoom:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // 特定のチャットルームを取得
    public function show(ChatRoom $chatRoom)
    {
        try {
            $chatRoom->load(['match.user1', 'match.user2', 'messages.sender']);
            return response()->json($chatRoom);
        } catch (\Exception $e) {
            Log::error('Error in ChatRoomController@show:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // チャットルームを削除
    public function destroy(ChatRoom $chatRoom)
    {
        try {
            $chatRoom->delete();
            return response()->json(['message' => 'Chat room deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error in ChatRoomController@destroy:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
