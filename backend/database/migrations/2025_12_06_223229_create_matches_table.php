<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user1_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('user2_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('skill_from_user1')
                ->constrained('skills')
                ->onDelete('cascade');

            $table->foreignId('skill_from_user2')
                ->constrained('skills')
                ->onDelete('cascade');

            $table->string('status', 50)->default('pending');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
