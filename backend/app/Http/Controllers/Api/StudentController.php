<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(): JsonResponse
    {
        $students = Student::orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'students' => $students]);
    }

    public function store(Request $request): JsonResponse
    {
        // Trim the email to prevent whitespace issues
        $request->merge(['email' => trim($request->email)]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'password' => 'required|string|min:6',
            'age' => 'nullable|integer',
            'school_name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'highest_qualification' => 'nullable|string',
            'transcript' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $browserSessionId = $request->header('X-Session-Id') ?? session()->getId();

        // Check if there is an existing quiz completion for this browser session
        $quizCompletion = \App\Models\QuizCompletion::where('session_id', $browserSessionId)->latest()->first();

        $persona = null;
        $quizCompleted = false;
        $quizResponse = null;

        if ($quizCompletion) {
            $persona = $quizCompletion->persona;
            $quizCompleted = true;
            $quizResponse = json_encode([
                'logic_score' => $quizCompletion->logic_score,
                'creative_score' => $quizCompletion->creative_score,
                'answers' => $quizCompletion->answers ?? [],
                'recommended_program_ids' => $quizCompletion->recommended_program_ids ?? [],
            ]);
        }

        // Generate a new unique session_id for this student account
        // This avoids duplicate key errors when the browser session was already used by another account
        $newSessionId = \Illuminate\Support\Str::uuid()->toString();

        // Check if a student already exists with the current browser session_id and update it instead
        $existingStudent = Student::where('session_id', $browserSessionId)->first();
        if ($existingStudent) {
            // Clear the old student's session so it doesn't conflict
            $existingStudent->update(['session_id' => \Illuminate\Support\Str::uuid()->toString()]);
        }

        $transcriptPath = null;
        if ($request->hasFile('transcript')) {
            $transcriptPath = $request->file('transcript')->store('transcripts', 'public');
        }

        $student = Student::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'age' => $validated['age'] ?? null,
            'school_name' => $validated['school_name'] ?? null,
            'phone_number' => $validated['phone_number'] ?? null,
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'highest_qualification' => $validated['highest_qualification'] ?? null,
            'persona' => $persona,
            'quiz_completed' => $quizCompleted,
            'quiz_response' => $quizResponse,
            'session_id' => $newSessionId,
            'transcript_path' => $transcriptPath,
        ]);

        return response()->json(['success' => true, 'student' => $student], 201);
    }

    public function login(Request $request): JsonResponse
    {
        // Trim the email to prevent whitespace issues
        $request->merge(['email' => trim($request->email)]);

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $student = Student::where('email', $request->email)->first();

        if (!$student) {
            return response()->json(['error' => 'User does not exist'], 404);
        }

        if (!\Illuminate\Support\Facades\Hash::check($request->password, $student->password)) {
            return response()->json(['error' => 'Invalid password'], 401);
        }

        // Update the session ID to the current one from the request header
        $sessionId = $request->header('X-Session-Id');
        if ($sessionId) {
            $quizCompletion = \App\Models\QuizCompletion::where('session_id', $sessionId)->latest()->first();

            $updateData = ['session_id' => $sessionId];

            if ($quizCompletion) {
                $updateData['persona'] = $quizCompletion->persona;
                $updateData['quiz_completed'] = true;
                $updateData['quiz_response'] = json_encode([
                    'logic_score' => $quizCompletion->logic_score,
                    'creative_score' => $quizCompletion->creative_score,
                    'answers' => $quizCompletion->answers ?? [],
                    'recommended_program_ids' => $quizCompletion->recommended_program_ids ?? [],
                ]);
            }

            \Illuminate\Support\Facades\DB::table('students')
                ->where('id', $student->id)
                ->update($updateData);

            // Refresh student data for response
            $student = Student::find($student->id);
        }

        return response()->json([
            'success' => true,
            'student' => $student
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        // Simple authentication using session_id sent via headers since we aren't using Sanctum currently
        $sessionId = $request->header('X-Session-Id');
        if (!$sessionId) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $student = Student::where('session_id', $sessionId)->first();
        if (!$student) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        return response()->json(['success' => true, 'student' => $student]);
    }

    public function update(Request $request): JsonResponse
    {
        $sessionId = $request->header('X-Session-Id');
        if (!$sessionId) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $student = Student::where('session_id', $sessionId)->first();
        if (!$student) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $request->merge(['email' => trim($request->email)]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email,' . $student->id,
            'password' => 'nullable|string|min:6',
            'age' => 'nullable|integer',
            'school_name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'highest_qualification' => 'nullable|string',
            'transcript' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'age' => $validated['age'] ?? null,
            'school_name' => $validated['school_name'] ?? null,
            'phone_number' => $validated['phone_number'] ?? null,
            'highest_qualification' => $validated['highest_qualification'] ?? null,
        ];

        if ($request->hasFile('transcript')) {
            $updateData['transcript_path'] = $request->file('transcript')->store('transcripts', 'public');
        }

        if (!empty($validated['password'])) {
            $updateData['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        }

        $student->update($updateData);

        return response()->json(['success' => true, 'student' => $student]);
    }

    /**
     * Update gamification stats (XP, level, quiz_count, best_combo) for the current student.
     */
    public function updateXp(Request $request): JsonResponse
    {
        $sessionId = $request->header('X-Session-Id');
        if (!$sessionId) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $student = Student::where('session_id', $sessionId)->first();
        if (!$student) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $validated = $request->validate([
            'xp_earned'  => 'required|integer|min:0|max:2000',
            'best_combo' => 'nullable|integer|min:0',
        ]);

        $newXp = ($student->xp ?? 0) + $validated['xp_earned'];
        $newLevel = $this->xpToLevel($newXp);
        $newBestCombo = max($student->best_combo ?? 0, $validated['best_combo'] ?? 0);

        $student->update([
            'xp'         => $newXp,
            'level'      => $newLevel,
            'quiz_count' => ($student->quiz_count ?? 0) + 1,
            'best_combo' => $newBestCombo,
        ]);

        $student->refresh();

        return response()->json([
            'success'  => true,
            'xp'       => $student->xp,
            'level'    => $student->level,
            'quiz_count' => $student->quiz_count,
            'best_combo' => $student->best_combo,
            'leveled_up' => $newLevel > ($this->xpToLevel($newXp - $validated['xp_earned'])),
        ]);
    }

    /** Convert total XP to a level (1–5). */
    private function xpToLevel(int $xp): int
    {
        if ($xp >= 1100) return 5;
        if ($xp >= 600)  return 4;
        if ($xp >= 300)  return 3;
        if ($xp >= 100)  return 2;
        return 1;
    }

    /**
     * Verify admin password from the X-Admin-Password header.
     * Returns null on success, or a JsonResponse with 401 on failure.
     */
    private function requireAdmin(Request $request): ?JsonResponse
    {
        $password = $request->header('X-Admin-Password');
        $expected = config('app.admin_password', 'admin123');
        if ($password !== $expected) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return null;
    }

    /**
     * Admin endpoint: update any student record by ID.
     * Used by the Admin > User Management tab so edits persist to MySQL.
     */
    public function adminUpdate(Request $request, int $id): JsonResponse
    {
        if ($denied = $this->requireAdmin($request)) {
            return $denied;
        }

        $student = Student::find($id);
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        if ($request->has('email')) {
            $request->merge(['email' => trim($request->email)]);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:students,email,' . $student->id,
            'age' => 'sometimes|nullable|integer',
            'persona' => 'sometimes|nullable|string|max:100',
            'highest_qualification' => 'sometimes|nullable|string',
        ]);

        // Only update fields explicitly sent in the request.
        $updateData = array_intersect_key($validated, array_flip([
            'name', 'email', 'age', 'persona', 'highest_qualification',
        ]));

        $student->update($updateData);
        $student->refresh();

        return response()->json(['success' => true, 'student' => $student]);
    }

    /**
     * Admin endpoint: delete a student record by ID.
     */
    public function adminDestroy(Request $request, int $id): JsonResponse
    {
        if ($denied = $this->requireAdmin($request)) {
            return $denied;
        }

        $student = Student::find($id);
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        $student->delete();

        return response()->json(['success' => true]);
    }
}
