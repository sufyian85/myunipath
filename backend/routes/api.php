<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;

Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/programs/{slug}', [ProgramController::class, 'show']);

Route::get('/quiz/questions', [QuizController::class, 'questions']);
Route::post('/quiz/submit', [QuizController::class, 'submit']);
Route::post('/recommend', [QuizController::class, 'recommend']);

Route::get('/students', [StudentController::class, 'index']);
Route::post('/students', [StudentController::class, 'store']);
Route::post('/login', [StudentController::class, 'login']);
Route::get('/students/me', [StudentController::class, 'me']);
Route::patch('/students/me', [StudentController::class, 'update']);
Route::post('/students/me/xp', [StudentController::class, 'updateXp']);

// Admin user management (guarded by X-Admin-Password header)
Route::patch('/admin/students/{id}', [StudentController::class, 'adminUpdate']);
Route::delete('/admin/students/{id}', [StudentController::class, 'adminDestroy']);

Route::post('/analytics/login', [AnalyticsController::class, 'login']);
Route::get('/analytics/dashboard', [AnalyticsController::class, 'dashboard']);
