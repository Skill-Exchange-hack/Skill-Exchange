<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Skill;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // スキルデータを挿入
        $skills = [
            ['id' => 1, 'name' => 'JavaScript', 'category' => 'プログラミング言語', 'description' => 'フロントエンド開発用の動的プログラミング言語'],
            ['id' => 2, 'name' => 'Python', 'category' => 'プログラミング言語', 'description' => 'データサイエンス・AI開発用の言語'],
            ['id' => 3, 'name' => 'Java', 'category' => 'プログラミング言語', 'description' => 'エンタープライズアプリケーション開発言語'],
            ['id' => 4, 'name' => 'C#', 'category' => 'プログラミング言語', 'description' => '.NET フレームワーク用の言語'],
            ['id' => 5, 'name' => 'C++', 'category' => 'プログラミング言語', 'description' => 'システムプログラミング・ゲーム開発'],
            ['id' => 6, 'name' => 'PHP', 'category' => 'プログラミング言語', 'description' => 'Webサーバーサイド開発用の言語'],
            ['id' => 7, 'name' => 'Ruby', 'category' => 'プログラミング言語', 'description' => 'Webアプリケーション開発言語'],
            ['id' => 8, 'name' => 'Go', 'category' => 'プログラミング言語', 'description' => 'マイクロサービス・システムプログラミング'],
            ['id' => 9, 'name' => 'Rust', 'category' => 'プログラミング言語', 'description' => 'メモリ安全性が強いシステムプログラミング言語'],
            ['id' => 10, 'name' => 'TypeScript', 'category' => 'プログラミング言語', 'description' => 'JavaScriptの型安全な拡張言語'],
            ['id' => 11, 'name' => 'Kotlin', 'category' => 'プログラミング言語', 'description' => 'Android開発・JVM言語'],
            ['id' => 12, 'name' => 'Swift', 'category' => 'プログラミング言語', 'description' => 'iOS・macOS アプリケーション開発言語'],
        ];

        foreach ($skills as $skill) {
            Skill::updateOrCreate(
                ['id' => $skill['id']],
                $skill
            );
        }

        // ユーザーデータを挿入
        User::factory()->create([
            'name' => 'Test User',
        ]);
    }
}
