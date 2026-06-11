<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('icon')->nullable();
            $table->string('short_desc');
            $table->string('color')->default('blue');
            $table->text('description')->nullable();
            $table->string('duration')->nullable();
            $table->string('fees')->nullable();
            $table->json('requirements')->nullable();
            $table->json('careers')->nullable();
            $table->json('highlights')->nullable();
            $table->json('why_this_program')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
