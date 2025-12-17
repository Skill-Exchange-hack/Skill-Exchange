<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;

    public $timestamps = true;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = ['chat_room_id', 'sender_id', 'message'];

    // チャットルームとの関係
    public function chatRoom()
    {
        return $this->belongsTo(ChatRoom::class);
    }

    // 送信者（ユーザー）との関係
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
