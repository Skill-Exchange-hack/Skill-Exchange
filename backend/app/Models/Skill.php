<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['name', 'category', 'description'];

    public function userSkills()
    {
        return $this->hasMany(UserSkill::class);
    }

    public function desiredSkills()
    {
        return $this->hasMany(DesiredSkill::class);
    }

    public function matchesFromUser1()
    {
        return $this->hasMany(UserMatch::class, 'skill_from_user1');
    }

    public function matchesFromUser2()
    {
        return $this->hasMany(UserMatch::class, 'skill_from_user2');
    }
}
