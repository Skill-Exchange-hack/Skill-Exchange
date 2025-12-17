<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserMatch extends Model
{
    use HasFactory;
    protected $table = 'matches';

    public $timestamps = true;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'user1_id', 'user2_id', 'skill_from_user1', 'skill_from_user2', 'status'
    ];

    public function user1()
    {
        return $this->belongsTo(User::class, 'user1_id');
    }

    public function user2()
    {
        return $this->belongsTo(User::class, 'user2_id');
    }

    public function skillFromUser1()
    {
        return $this->belongsTo(Skill::class, 'skill_from_user1');
    }

    public function skillFromUser2()
    {
        return $this->belongsTo(Skill::class, 'skill_from_user2');
    }

    // チャットルームとの関係
    public function chatRoom()
    {
        return $this->hasOne(ChatRoom::class, 'match_id');
    }

    // 2人のユーザーを取得
    public function users()
    {
        return [$this->user1, $this->user2];
    }
}
