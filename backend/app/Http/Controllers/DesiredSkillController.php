<?php

namespace App\Http\Controllers;

use App\Models\DesiredSkill;
use Illuminate\Http\Request;

class DesiredSkillController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->query('user_id');
        if ($userId) {
            $desiredSkills = DesiredSkill::where('user_id', $userId)->with('skill')->get();
            return response()->json($desiredSkills);
        }
        return response()->json(DesiredSkill::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'skill_id' => 'required|exists:skills,id',
        ]);

        $desiredSkill = DesiredSkill::create($validated);
        return response()->json($desiredSkill, 201);
    }

    public function show(DesiredSkill $desiredSkill)
    {
        return response()->json($desiredSkill);
    }

    public function update(Request $request, DesiredSkill $desiredSkill)
    {
        $validated = $request->validate([
            'skill_id' => 'sometimes|exists:skills,id',
        ]);

        $desiredSkill->update($validated);
        return response()->json($desiredSkill);
    }

    public function destroy(DesiredSkill $desiredSkill)
    {
        $desiredSkill->delete();
        return response()->json(['message' => 'DesiredSkill deleted successfully']);
    }
}
