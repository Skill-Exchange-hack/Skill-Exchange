<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->nullable();
            $table->text('description')->nullable();
        });

        // スキルデータを自動投入
        $this->insertSkillsData();
    }

    public function down(): void
    {
        Schema::dropIfExists('skills');
    }

    private function insertSkillsData(): void
    {
        $skills = [
            [
                'id' => 1,
                'name' => 'JavaScript',
                'category' => 'プログラミング言語',
                'description' => 'フロントエンド開発用の動的プログラミング言語',
            ],
            [
                'id' => 2,
                'name' => 'Python',
                'category' => 'プログラミング言語',
                'description' => 'データサイエンス・AI開発用の言語',
            ],
            [
                'id' => 3,
                'name' => 'Java',
                'category' => 'プログラミング言語',
                'description' => 'エンタープライズアプリケーション開発言語',
            ],
            [
                'id' => 4,
                'name' => 'C#',
                'category' => 'プログラミング言語',
                'description' => '.NET フレームワーク用の言語',
            ],
            [
                'id' => 5,
                'name' => 'C++',
                'category' => 'プログラミング言語',
                'description' => 'システムプログラミング・ゲーム開発',
            ],
            [
                'id' => 6,
                'name' => 'PHP',
                'category' => 'プログラミング言語',
                'description' => 'Webサーバーサイド開発用の言語',
            ],
            [
                'id' => 7,
                'name' => 'Ruby',
                'category' => 'プログラミング言語',
                'description' => 'Webアプリケーション開発言語',
            ],
            [
                'id' => 8,
                'name' => 'Go',
                'category' => 'プログラミング言語',
                'description' => 'マイクロサービス・システムプログラミング',
            ],
            [
                'id' => 9,
                'name' => 'Rust',
                'category' => 'プログラミング言語',
                'description' => 'メモリ安全性が強いシステムプログラミング言語',
            ],
            [
                'id' => 10,
                'name' => 'TypeScript',
                'category' => 'プログラミング言語',
                'description' => 'JavaScriptの型安全な拡張言語',
            ],
            [
                'id' => 11,
                'name' => 'Kotlin',
                'category' => 'プログラミング言語',
                'description' => 'Android開発・JVM上で動作する言語',
            ],
            [
                'id' => 12,
                'name' => 'Swift',
                'category' => 'プログラミング言語',
                'description' => 'iOS・macOS開発言語',
            ],
        ];

        DB::table('skills')->insert($skills);
    }
};
