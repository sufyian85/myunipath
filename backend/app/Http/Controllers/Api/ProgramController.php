<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index(): JsonResponse
    {
        $programs = Program::orderBy('name')->get();
        return response()->json($programs);
    }

    public function show(string $slug): JsonResponse
    {
        $program = Program::where('slug', $slug)->first();
        if (!$program) {
            return response()->json(['error' => 'Program not found'], 404);
        }
        return response()->json($program);
    }
}
