<?php

namespace App\Models;

use App\Models\UserMatch;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    public $timestamps = true;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null; // updated_at がないので null に設定

    protected $fillable = ['name'];

    // 所持スキル
    public function userSkills()
    {
        return $this->hasMany(UserSkill::class);
    }

    // 欲しいスキル
    public function desiredSkills()
    {
        return $this->hasMany(DesiredSkill::class);
    }

    // マッチング
    public function matchesAsUser1()
    {
        return $this->hasMany(UserMatch::class, 'user1_id');
    }

    public function matchesAsUser2()
    {
        return $this->hasMany(UserMatch::class, 'user2_id');
    }

    // 送信したチャットメッセージ
    public function sentMessages()
    {
        return $this->hasMany(ChatMessage::class, 'sender_id');
    }
}
