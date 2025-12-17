<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\ChatRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatMessageController extends Controller
{
    // チャットルームのメッセージ一覧を取得
    public function index(Request $request)
    {
        try {
            $chatRoomId = $request->query('chat_room_id');
            $limit = $request->query('limit', 50);
            $offset = $request->query('offset', 0);

            if (!$chatRoomId) {
                return response()->json(['error' => 'chat_room_id is required'], 400);
            }

            // チャットルームの存在確認
            $chatRoom = ChatRoom::find($chatRoomId);
            if (!$chatRoom) {
                return response()->json(['error' => 'Chat room not found'], 404);
            }

            $messages = ChatMessage::where('chat_room_id', $chatRoomId)
                ->with('sender')
                ->orderBy('created_at', 'asc')
                ->limit($limit)
                ->offset($offset)
                ->get();

            return response()->json($messages);
        } catch (\Exception $e) {
            Log::error('Error in ChatMessageController@index:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // メッセージを送信
    public function store(Request $request)
    {
        try {
            Log::info('ChatMessage store request:', $request->all());

            $validated = $request->validate([
                'chat_room_id' => 'required|integer|exists:chat_rooms,id',
                'sender_id' => 'required|integer|exists:users,id',
                'message' => 'required|string|min:1|max:5000',
            ]);

            $chatMessage = ChatMessage::create($validated);
            $chatMessage->load('sender');
            
            Log::info('ChatMessage created:', $chatMessage->toArray());
            return response()->json($chatMessage, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation failed:', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating ChatMessage:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // 特定のメッセージを取得
    public function show(ChatMessage $chatMessage)
    {
        try {
            $chatMessage->load('sender', 'chatRoom');
            return response()->json($chatMessage);
        } catch (\Exception $e) {
            Log::error('Error in ChatMessageController@show:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // メッセージを削除（送信者のみ）
    public function destroy(Request $request, ChatMessage $chatMessage)
    {
        try {
            $userId = $request->query('user_id');

            // 送信者のみ削除可能
            if ($chatMessage->sender_id != $userId) {
                return response()->json(['error' => 'You can only delete your own messages'], 403);
            }

            $chatMessage->delete();
            return response()->json(['message' => 'Chat message deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error in ChatMessageController@destroy:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // チャットルームの最新メッセージを取得
    public function getLatest(Request $request)
    {
        try {
            $chatRoomId = $request->query('chat_room_id');
            $count = $request->query('count', 20);

            if (!$chatRoomId) {
                return response()->json(['error' => 'chat_room_id is required'], 400);
            }

            $messages = ChatMessage::where('chat_room_id', $chatRoomId)
                ->with('sender')
                ->orderBy('created_at', 'desc')
                ->limit($count)
                ->get()
                ->reverse()
                ->values();

            return response()->json($messages);
        } catch (\Exception $e) {
            Log::error('Error in ChatMessageController@getLatest:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
