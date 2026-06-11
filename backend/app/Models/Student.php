<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'password',
        'age',
        'spm_result_path',
        'persona',
        'highest_qualification',
        'quiz_completed',
        'session_id',
        'quiz_response',
        'transcript_path',
        'xp',
        'level',
        'quiz_count',
        'best_combo',
        'school_name',
        'phone_number',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'quiz_completed' => 'boolean',
        'quiz_response' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
