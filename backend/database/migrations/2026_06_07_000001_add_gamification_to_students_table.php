<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->unsignedInteger('xp')->default(0)->after('transcript_path');
            $table->unsignedTinyInteger('level')->default(1)->after('xp');
            $table->unsignedInteger('quiz_count')->default(0)->after('level');
            $table->unsignedInteger('best_combo')->default(0)->after('quiz_count');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['xp', 'level', 'quiz_count', 'best_combo']);
        });
    }
};
