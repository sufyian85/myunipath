<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizCompletion extends Model
{
    protected $fillable = [
        'user_id', 'persona', 'logic_score', 'creative_score',
        'answers', 'recommended_program_ids', 'session_id', 'ip_address', 'user_agent',
    ];

    protected $casts = [
        'answers' => 'array',
        'recommended_program_ids' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
