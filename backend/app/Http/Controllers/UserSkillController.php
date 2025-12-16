<?php

namespace App\Http\Controllers;

use App\Models\UserSkill;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        try {
            Log::info('UserSkill store request:', $request->all());

            // スキルが存在するか確認
            $skill = Skill::find($request->skill_id);
            if (!$skill) {
                Log::warning('Skill not found:', ['skill_id' => $request->skill_id]);
                Log::info('Available skills:', Skill::all(['id', 'name'])->toArray());
                return response()->json([
                    'error' => 'Skill not found',
                    'skill_id' => $request->skill_id,
                    'available_skills' => Skill::all(['id', 'name'])->toArray(),
                ], 404);
            }

            $validated = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'skill_id' => 'required|integer|exists:skills,id',
                'level' => 'nullable|string',
                'description' => 'nullable|string',
            ]);

            $userSkill = UserSkill::create($validated);
            Log::info('UserSkill created:', $userSkill->toArray());
            return response()->json($userSkill, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation failed:', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating UserSkill:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
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

