<?php

use App\Models\Student;
use App\Models\QuizCompletion;

$students = Student::all();
echo "Total students: " . $students->count() . "\n";

foreach ($students as $s) {
    $c = QuizCompletion::where('session_id', $s->session_id)->latest()->first();
    if ($c) {
        $s->update([
            'persona' => $c->persona,
            'quiz_completed' => true,
        ]);
        echo "Updated: {$s->name} -> {$c->persona}\n";
    } else {
        echo "No quiz found for: {$s->name} (session: {$s->session_id})\n";
    }
}

echo "Done.\n";
