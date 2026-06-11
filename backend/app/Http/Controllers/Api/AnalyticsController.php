<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuizCompletion;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AnalyticsController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $password = $request->header('X-Admin-Password') ?? $request->input('password');
        $expected = config('app.admin_password', 'admin123');
        if ($password !== $expected) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // ── Quiz Completions ────────────────────────────────────────────────
        // Dedupe by session_id, keeping only the latest attempt per session.
        $latestPerSession = QuizCompletion::orderBy('created_at', 'desc')
            ->get()
            ->unique('session_id')
            ->values();

        $totalParticipants = $latestPerSession->count();

        $personaCounts = $latestPerSession->groupBy('persona')
            ->map->count()
            ->toArray();

        $programCounts = [];
        foreach ($latestPerSession as $c) {
            // Only count the primary (first) recommended programme — the student's top match
            $ids = $c->recommended_program_ids ?? [];
            if (!empty($ids)) {
                $primary = $ids[0];
                $programCounts[$primary] = ($programCounts[$primary] ?? 0) + 1;
            }
        }

        // ── Registered Students ─────────────────────────────────────────────
        $students = Student::orderBy('created_at', 'desc')->get();
        $totalRegistered = $students->count();
        $quizCompletedCount = $students->where('quiz_completed', true)->count();

        // School breakdown — group by school_name, count, top schools
        $schoolCounts = $students
            ->whereNotNull('school_name')
            ->where('school_name', '!=', '')
            ->groupBy('school_name')
            ->map->count()
            ->sortDesc()
            ->toArray();

        // Qualification breakdown
        $qualificationCounts = $students
            ->whereNotNull('highest_qualification')
            ->groupBy('highest_qualification')
            ->map->count()
            ->toArray();

        // ── Daily Registration Trend (last 30 days) ─────────────────────────
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        $dailyRegistrations = $students
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy(fn ($s) => Carbon::parse($s->created_at)->format('Y-m-d'))
            ->map->count()
            ->sortKeys()
            ->toArray();

        // ── Daily Quiz Completions Trend (last 30 days) ─────────────────────
        $allCompletions = QuizCompletion::orderBy('created_at', 'asc')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->get()
            ->unique('session_id');

        $dailyCompletions = $allCompletions
            ->groupBy(fn ($c) => Carbon::parse($c->created_at)->format('Y-m-d'))
            ->map->count()
            ->sortKeys()
            ->toArray();

        // ── Age Distribution ────────────────────────────────────────────────
        $ageBuckets = [
            '< 17' => 0,
            '17-18' => 0,
            '19-21' => 0,
            '22-25' => 0,
            '> 25' => 0,
        ];
        foreach ($students as $s) {
            $age = (int) $s->age;
            if ($age < 1) continue;
            if ($age < 17) $ageBuckets['< 17']++;
            elseif ($age <= 18) $ageBuckets['17-18']++;
            elseif ($age <= 21) $ageBuckets['19-21']++;
            elseif ($age <= 25) $ageBuckets['22-25']++;
            else $ageBuckets['> 25']++;
        }

        // ── Engagement: avg XP ───────────────────────────────────────────────
        $studentsWithXp = $students->where('xp', '>', 0);
        $avgXp = $studentsWithXp->count() > 0
            ? round($studentsWithXp->avg('xp'), 1)
            : 0;

        $levelCounts = $students
            ->groupBy(fn ($s) => 'Level ' . ($s->level ?? 1))
            ->map->count()
            ->toArray();

        return response()->json([
            // ── overview ──
            'totalParticipants' => $totalParticipants,
            'totalRegistered' => $totalRegistered,
            'quizCompletedCount' => $quizCompletedCount,
            'completionRate' => $totalRegistered > 0
                ? round(($quizCompletedCount / $totalRegistered) * 100, 1)
                : 0,

            // ── programme / persona ──
            'personaCounts' => $personaCounts,
            'programCounts' => $programCounts,

            // ── student demographics ──
            'schoolCounts' => $schoolCounts,
            'qualificationCounts' => $qualificationCounts,
            'ageCounts' => $ageBuckets,

            // ── engagement ──
            'avgXp' => $avgXp,
            'levelCounts' => $levelCounts,

            // ── trends ──
            'dailyRegistrations' => $dailyRegistrations,
            'dailyCompletions' => $dailyCompletions,

            // ── raw completions for table ──
            'completions' => $latestPerSession->map(fn ($c) => [
                'id' => $c->id,
                'persona' => $c->persona,
                'program_ids' => $c->recommended_program_ids,
                'created_at' => $c->created_at ? $c->created_at->toIso8601String() : null,
            ])->values(),
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $password = $request->input('password');
        $expected = config('app.admin_password', 'admin123');
        if ($password === 