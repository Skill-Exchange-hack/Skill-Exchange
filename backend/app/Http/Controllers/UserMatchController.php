<?php

namespace App\Http\Controllers;

use App\Models\UserMatch;
use Illuminate\Http\Request;

class UserMatchController extends Controller
{
    public function index()
    {
        return response()->json(UserMatch::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user1_id' => 'required|exists:users,id',
            'user2_id' => 'required|exists:users,id',
            'skill_from_user1' => 'required|exists:skills,id',
            'skill_from_user2' => 'required|exists:skills,id',
            'status' => 'nullable|string',
        ]);

        // デフォルトstatus
        if (!isset($validated['status'])) {
            $validated['status'] = 'pending';
        }

        $userMatch = UserMatch::create($validated);
        return response()->json($userMatch, 201);
    }

    public function show(UserMatch $userMatch)
    {
        return response()->json($userMatch);
    }

    public function update(Request $request, UserMatch $userMatch)
    {
        $validated = $request->validate([
            'status' => 'sometimes|string',
        ]);

        $userMatch->update($validated);
        return response()->json($userMatch);
    }

    public function destroy(UserMatch $userMatch)
    {
        $userMatch->delete();
        return response()->json(['message' => 'UserMatch deleted successfully']);
    }
}
