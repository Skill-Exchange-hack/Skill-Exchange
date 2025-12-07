<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index()
    {
        return response()->json(Skill::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $skill = Skill::create($validated);
        return response()->json($skill, 201);
    }

    public function show(Skill $skill)
    {
        return response()->json($skill);
    }

    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
        ]);

        $skill->update($validated);
        return response()->json($skill);
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();
        return response()->json(['message' => 'Skill deleted successfully']);
    }
}
