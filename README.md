# Skill-Exchange

## 開発手順
チーム開発でのルールを定めてあるのでコードをpull,clone（ローカルに取り込む）前にWikiを見てほしいです。

## ブランチ戦略
Github Flowです。なのでブランチのマージ後は必ず削除をするようにしてください。

## フローの流れ（コンフリクト回避のため）
 - あらかじめmainリポジトリへのpushは禁止をしております。なのでフォルダを中心に役割を分けてなるべくコンフリクトを起こさない。
 - 各役割ごとにブランチを作りPRを行う。
 - プルリクエストの承認を自分で行わないこと

## リポジトリ
フロントエンド・バックエンドのプロジェクトを同じリポジトリで使用をします。（モノリポ）  
そしてプロジェクトの名前はフロントエンドは**frontend**、バックエンドは**backend**にしてください。

## 技術スタック
 - フロントエンド：React
 - バックエンド：Laravel
 - ミドルウェア：MySQL

## ホスティング先
 - フロントエンド（React）：Vercel or Heroku or CloudFront
 - バックエンド（Laravel）：Heroku or AWS
※フロントエンド担当の方はホスティング先を決め次第norman6464に連絡ください。

## データベース設計（ER図）
このカラムなどを参考にしてDOA（データ指向プログラミング）に沿ってUIなどを作ってください。出ないとデータベースの作り直し = 処理ロジック全体の作り直しがおき、Laravel → ReactのJSONデータのやり取りで不備が起きプロジェクトの遅延が起きます。  

[DOPの概念](https://zenn.dev/chillnn_tech/articles/e78a76f94ad45a)  

**テーブル名**  
 - users
 - skills
 - user_skills
 - desired_skills
 - matches（マッチング）
 
 **リレーションシップ**
 Nは一体多の多側です。  
 - Users ↔ UserSkills（1:N）
 - Users ↔ DesiredSkills（1:N）
 - Skills ↔ UserSkills（1:N）
 - Skills ↔ DesiredSkills（1:N）
 - Users ↔ Matches（1:N ×2）
 - Skills ↔ Matches（1:N ×2）
 
![ER図](diagrams/image.png)

## UI/UXの図
norman6464のチャットにFigmaなどで完成させた図などをください。そしたらこちらでREADMEの編集をします。

## プロジェクト導入手順
**フロントエンド（React）の場合**
```
npm install
```

**バックエンドの場合**
```
composer install
```
node_modulesのインストール
```
npm install
```

### 注意事項

今回のバックエンドの導入手順の際に.envファイルの編集が必ず必要になります  
なのでcodespaceなどで設定する際にはnorman6464に連絡をください。

Laravelは今回APIサーバーとして起動をしているのでphp artisan serveコマンドを打った際にはpunlic/index.phpのファイルはレンダリングをしません。  

なので設定では必ずjson形式でデータを返すようにできています。


### 現在のバックエンドの変更
1. CRUDの実装完了
2. routes/api.phpの編集
3. config/cors.phpの編集（ローカルのReactのポートのみ使用許可）
4. SQLiteのデータベース変更