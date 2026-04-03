# PostgreSQLコマンド手順書

**作成日:** 2026-03-30

---

## このプロジェクトの接続情報

```
ホスト:    localhost
ポート:    5432
DB名:     todoapp
ユーザー:  postgres
パスワード: postgres（.envファイルで管理）
```

> **注意:** 接続情報は `.env` ファイルで管理されています。パスワードを変更した場合は `.env` を更新してください。

---

## DBへの接続方法

### 方法1：コンテナ内から psql で接続（CLI）

```bash
# TodoAppフォルダで実行すること
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec db psql -U postgres -d todoapp
```

接続後のプロンプト：
```
todoapp=#   ← ここにコマンドやSQLを入力する
```

### 方法2：GUIツールから接続（TablePlus / DBeaver / pgAdmin）

```
Host:     localhost
Port:     5432
Database: todoapp
User:     postgres
Password: postgres
```

---

## psql メタコマンド

psql 接続中に使える `\` から始まるコマンド。

| コマンド | 説明 |
|---------|------|
| `\l` | データベース一覧を表示 |
| `\dt` | テーブル一覧を表示 |
| `\d テーブル名` | テーブルの構造（カラム・型・制約）を表示 |
| `\di` | インデックス一覧を表示 |
| `\du` | ユーザー（ロール）一覧を表示 |
| `\c DB名` | 別のデータベースに接続を切り替える |
| `\timing` | SQLの実行時間を表示する（トグル） |
| `\x` | 結果を縦表示にする（レコードが多いカラムの場合に便利） |
| `\e` | エディタを開いてSQLを書く |
| `\i ファイルパス` | SQLファイルを実行する |
| `\q` | psqlを終了する |

---

## よく使うSQL

### データを確認する

```sql
-- テーブルの全データを取得
SELECT * FROM "Todos";

-- 件数を確認
SELECT COUNT(*) FROM "Todos";

-- 条件を絞って取得
SELECT * FROM "Todos" WHERE "IsCompleted" = false;

-- 並び替えて取得
SELECT * FROM "Todos" ORDER BY "CreatedAt" DESC;

-- 件数を制限して取得（最新10件）
SELECT * FROM "Todos" ORDER BY "CreatedAt" DESC LIMIT 10;
```

### データを操作する

```sql
-- データを追加
INSERT INTO "Todos" ("Title", "IsCompleted", "CreatedAt")
VALUES ('タスク名', false, NOW());

-- データを更新
UPDATE "Todos" SET "IsCompleted" = true WHERE "Id" = 1;

-- データを削除
DELETE FROM "Todos" WHERE "Id" = 1;

-- テーブルの全データを削除（IDリセットなし）
DELETE FROM "Todos";

-- テーブルの全データを削除（IDもリセット）
TRUNCATE TABLE "Todos" RESTART IDENTITY;
```

### テーブル構造を確認する

```sql
-- テーブル一覧
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- カラム情報を確認
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Todos';
```

---

## マイグレーション関連

このプロジェクトは Entity Framework Core を使用しています。
マイグレーションはバックエンドコンテナ内から実行します。

```bash
# バックエンドコンテナに入る
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend bash

# コンテナ内でマイグレーションを実行
dotnet ef database update
```

### マイグレーションの状態を確認するSQL

```sql
-- 適用済みマイグレーションの一覧
SELECT * FROM "__EFMigrationsHistory";
```

---

## バックアップとリストア

### バックアップ（dump）

```bash
# コンテナ内でバックアップを取る
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec db \
  pg_dump -U postgres todoapp > backup.sql
```

### リストア

```bash
# バックアップからリストアする
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec -T db \
  psql -U postgres todoapp < backup.sql
```

---

## よくあるトラブルと対処

### DBに接続できない

```
考えられる原因と確認手順:

1. コンテナが起動しているか確認
   docker compose -f docker-compose.yml -f docker-compose.dev.yml ps

2. db の STATUS が running (healthy) になっているか確認
   → starting の場合はしばらく待つ
   → exited の場合はログを確認
   docker compose -f docker-compose.yml -f docker-compose.dev.yml logs db

3. .env のパスワードが正しいか確認
```

### データをリセットしたい

```bash
# コンテナとDBデータを完全削除して再起動
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### psql の終了方法

```
todoapp=# \q
```

---

## 接続情報の管理

```
.env（Gitに含めない）
├── POSTGRES_DB=todoapp        ← DB名
├── POSTGRES_USER=postgres     ← ユーザー名
└── POSTGRES_PASSWORD=postgres ← パスワード

.env.example（Gitに含める・テンプレート）
├── POSTGRES_DB=todoapp
├── POSTGRES_USER=postgres
└── POSTGRES_PASSWORD=（任意のパスワード）
```

新しい環境でセットアップする場合：
```bash
cp .env.example .env
# .env を開いてパスワードを設定する
```
