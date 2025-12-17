<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    use HasFactory;

    public $timestamps = true;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = ['match_id'];

    // マッチングとの関係
    public function match()
    {
        return $this->belongsTo(UserMatch::class, 'match_id');
    }

    // チャットメッセージとの関係
    public function messages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    // マッチに関連する2人のユーザーを取得
    public function users()
    {
        return $this->match->users();
    }
}
