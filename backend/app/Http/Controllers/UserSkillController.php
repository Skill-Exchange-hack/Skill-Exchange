<?php

namespace App\Http\Controllers;

use App\Models\UserSkill;
use Illuminate\Http\Request;

class UserSkillController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->query('user_id');
        if ($userId) {
            $userSkills = UserSkill::where('user_id', $userId)->with('skill')->get();
            return response()->json($userSkills);
        }
        return response()->json(UserSkill::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'skill_id' => 'required|exists:skills,id',
            'level' => 'nullable|string',
        ]);

        $userSkill = UserSkill::create($validated);
        return response()->json($userSkill, 201);
    }

    public function show(UserSkill $userSkill)
    {
        return response()->json($userSkill);
    }

    public function update(Request $request, UserSkill $userSkill)
    {
        $validated = $request->validate([
            'level' => 'sometimes|string',
        ]);

        $userSkill->update($validated);
        return response()->json($userSkill);
    }

    public function destroy(UserSkill $userSkill)
    {
        $userSkill->delete();
        return response()->json(['message' => 'UserSkill deleted successfully']);
    }
}
