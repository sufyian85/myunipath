<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
        'slug', 'name', 'icon', 'short_desc', 'color',
        'description', 'duration', 'fees',
        'requirements', 'careers', 'highlights', 'why_this_program',
    ];

    protected $casts = [
        'requirements' => 'array',
        'careers' => 'array',
        'highlights' => 'array',
        'why_this_program' => 'array',
    ];
}
