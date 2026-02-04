# Skill-Exchange 🔄

<p align="center">
  <strong>スキルマッチングプラットフォーム</strong><br>
  プログラミングスキルを教え合い、共に成長できるマッチングサービス
</p>

---

## 📖 概要

Skill-Exchangeは、プログラミングスキルを持つユーザー同士をマッチングし、互いに教え合うことができるプラットフォームです。

**解決する課題**
- 独学でのプログラミング学習における挫折
- 適切なメンターを見つける難しさ
- スキル習得における高速なフィードバックの不足

**ソリューション**
- ユーザーの「持っているスキル」と「学びたいスキル」を登録
- 最適なマッチングアルゴリズムで相互学習パートナーを提案
- チャットベースで課題の出題とフィードバックを実現

---

## 🛠️ 技術スタック

<h3>Frontend</h3>
<a href="https://skillicons.dev">
  <img src="https://skillicons.dev/icons?i=react,vite&theme=light" alt="Frontend">
</a>

<h3>Backend</h3>
<a href="https://skillicons.dev">
  <img src="https://skillicons.dev/icons?i=laravel,php&theme=light" alt="Backend">
</a>

<h3>Database</h3>
<a href="https://skillicons.dev">
  <img src="https://skillicons.dev/icons?i=mysql,sqlite&theme=light" alt="Database">
</a>

<h3>Infrastructure / Hosting</h3>
<a href="https://skillicons.dev">
  <img src="https://skillicons.dev/icons?i=aws,vercel,cloudflare&theme=light" alt="Infrastructure">
</a>

<h3>Tools</h3>
<a href="https://skillicons.dev">
  <img src="https://skillicons.dev/icons?i=git,github&theme=light" alt="Tools">
</a>

---

## 📐 アーキテクチャ

```
┌─────────────┐     JSON      ┌─────────────┐     SQL      ┌─────────────┐
│   React     │ ◄──────────► │   Laravel   │ ◄──────────► │   MySQL     │
│  (Frontend) │    REST API   │  (Backend)  │              │ (Database)  │
└─────────────┘               └─────────────┘              └─────────────┘
```

**リポジトリ構成**: モノレポ（Frontend / Backend を同一リポジトリで管理）

---

## 📊 データベース設計

### テーブル構成

| テーブル名 | 説明 |
|-----------|------|
| `users` | ユーザー情報 |
| `skills` | スキルマスタ |
| `user_skills` | ユーザーが持つスキル |
| `desired_skills` | ユーザーが学びたいスキル |
| `matches` | マッチング情報 |

### ER図

```
Users ──┬── 1:N ──► UserSkills ◄── N:1 ──┬── Skills
        │                                  │
        ├── 1:N ──► DesiredSkills ◄── N:1 ─┤
        │                                  │
        └── 1:N ──► Matches ◄── N:1 ───────┘
```

![ER図](diagrams/image.png)

---

## 🚀 セットアップ

### 必要な環境

- Node.js (v18以上推奨)
- PHP (v8.1以上)
- Composer

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

### Backend (Laravel)

```bash
cd backend
composer install
npm install
cp .env.example .env
php artisan key:generate
```

**データベースの設定**

```bash
# SQLiteを使用する場合
touch database/database.sqlite
php artisan migrate
```

**サーバー起動**

```bash
php artisan serve
```

---

## 🔌 API エンドポイント

### ユーザー作成

```bash
curl -X POST http://127.0.0.1:8000/api/users \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{"name":"norman"}'
```

### ユーザー一覧取得

```bash
curl -X GET http://127.0.0.1:8000/api/users \
     -H "Accept: application/json"
```

---

## 👥 チーム開発ルール

### ブランチ戦略

**GitHub Flow**を採用しています。

```
main ◄─── feature/xxx ◄─── 作業ブランチ
      PR & Review
```

- `main`への直接pushは禁止
- 機能ごとにブランチを作成し、PRを提出
- PRの承認は本人以外が行う
- マージ後はブランチを削除

### コンフリクト回避

- フォルダ単位で担当を分担
- PRは小さく、こまめに作成

---

## 📁 ディレクトリ構成

```
Skill-Exchange/
├── frontend/          # React アプリケーション
│   ├── src/
│   └── package.json
├── backend/           # Laravel API サーバー
│   ├── app/
│   ├── routes/
│   │   └── api.php    # APIルーティング
│   ├── config/
│   │   └── cors.php   # CORS設定
│   └── composer.json
├── diagrams/          # 設計図
└── README.md
```

---

## ✅ 実装状況

- [x] CRUD機能の実装
- [x] APIルーティング (routes/api.php)
- [x] CORS設定 (config/cors.php)
- [x] SQLiteデータベース対応
- [x] マッチングアルゴリズム
- [x] チャット機能
- [x] UI/UX実装

---

## 📝 注意事項

- `.env`ファイルの設定が必要です。詳細は [@norman6464](https://github.com/norman6464) にお問い合わせください
- LaravelはAPIサーバーとして動作するため、`public/index.php`のレンダリングは行いません
- すべてのレスポンスはJSON形式で返却されます

---

## 👨‍💻 開発メンバー

- [@norman6464](https://github.com/norman6464) - Backend / Infrastructure / Scrum Master
- [@Yamamoto8810](https://github.com/Yamamoto8810) - Frontend / Project Reader
- [@ShoKino5335](https://github.com/ShoKino5335) - Frontend / Infrastructure
- [@inuzakakeno](https://github.com/inuzakakeno) - Planning / proposal
 

---

## 📄 ライセンス

MIT License
