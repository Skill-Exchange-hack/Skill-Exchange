<?php

namespace App\Http\Controllers;

use App\Models\DesiredSkill;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        try {
            Log::info('DesiredSkill store request:', $request->all());

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
                'priority' => 'nullable|integer|min:1|max:3',
            ]);

            // 同じユーザーが同じスキルを既に追加しているか確認
            $existingDesired = DesiredSkill::where('user_id', $validated['user_id'])
                ->where('skill_id', $validated['skill_id'])
                ->first();

            if ($existingDesired) {
                Log::warning('Duplicate desired skill:', $validated);
                return response()->json([
                    'error' => 'このスキルは既に追加されています',
                    'desired_skill' => $existingDesired,
                ], 409);  // 409 Conflict
            }

            $desiredSkill = DesiredSkill::create($validated);
            Log::info('DesiredSkill created:', $desiredSkill->toArray());
            return response()->json($desiredSkill, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation failed:', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating DesiredSkill:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
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

