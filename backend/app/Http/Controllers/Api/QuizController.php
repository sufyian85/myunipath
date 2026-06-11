<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuizCompletion;
use App\Models\QuizQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function questions(): JsonResponse
    {
        $questions = QuizQuestion::orderBy('order')->get()->map(fn($q) => [
            'id' => $q->id,
            'question' => $q->question,
            'options' => $q->options,
        ]);
        return response()->json($questions);
    }

    public function submit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'persona' => 'required|string|max:100',
            'logic_score' => 'nullable|integer|min:0|max:64',
            'creative_score' => 'nullable|integer|min:0|max:64',
            'answers' => 'nullable|array',
            'recommended_program_ids' => 'required|array',
        ]);

        $sessionId = $request->header('X-Session-Id') ?? session()->getId();

        $completion = QuizCompletion::create([
            'persona' => $validated['persona'],
            'logic_score' => $validated['logic_score'] ?? 0,
            'creative_score' => $validated['creative_score'] ?? 0,
            'answers' => $validated['answers'] ?? [],
            'recommended_program_ids' => $validated['recommended_program_ids'],
            'session_id' => $sessionId,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Also update the student record if they are logged in (associated by session_id)
        $student = \App\Models\Student::where('session_id', $sessionId)->first();
        if ($student) {
            \Illuminate\Support\Facades\DB::table('students')
                ->where('id', $student->id)
                ->update([
                    'persona' => $validated['persona'],
                    'quiz_completed' => true,
                    'quiz_response' => json_encode([
                        'logic_score' => $validated['logic_score'],
                        'creative_score' => $validated['creative_score'],
                        'answers' => $validated['answers'] ?? [],
                        'recommended_program_ids' => $validated['recommended_program_ids'],
                    ]),
                    'updated_at' => now(),
                ]);
        }

        return response()->json([
            'success' => true,
            'completion_id' => $completion->id,
        ]);
    }

    public function recommend(Request $request, \App\Services\RecommendationEngine $engine): JsonResponse
    {
        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'string'
        ]);

        $result = $engine->calculate($validated['answers']);

        return response()->json([
            'success' => true,
            'persona' => $result['persona'],
            'score_breakdown' => $result['score_breakdown']
        ]);
    }
}
