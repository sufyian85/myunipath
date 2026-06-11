<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->unique();
            $table->string('name');
            $table->string('email')->nullable()->unique();
            $table->string('password');
            $table->string('age')->nullable();
            $table->string('persona')->nullable();
            $table->boolean('quiz_completed')->default(false);
            $table->json('quiz_response')->nullable();
            $table->string('spm_result_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
