# requirements.md — バックエンド追加

**作成日:** 2026-03-28
**対象ステアリング:** `.steering/20260328-add-backend/`

---

## 1. 概要

v1.0のフロントエンド（TypeScript + Vite）に対して、C# ASP.NET Core Web APIによるバックエンドを追加する。
現在ローカルストレージで管理しているTodoデータをPostgreSQLデータベースで永続化し、複数デバイス間でのデータ共有を実現する。

---

## 2. ユーザーストーリー

```
US-BE-01: データがサーバーに保存される
  ユーザーとして、
  タスクをサーバー側のデータベースに保存したい
  なぜなら、デバイスを変えてもタスクが同期されるから

US-BE-02: タスクを取得する
  ユーザーとして、
  ページを開いたときにサーバーからタスク一覧を取得したい
  なぜなら、どのデバイスからでも最新のタスクを確認できるから
```

---

## 3. 機能要件

### REST API エンドポイント

| メソッド | エンドポイント | 説明 |
|---------|--------------|------|
| GET | `/api/todos` | タスク一覧取得 |
| POST | `/api/todos` | タスク作成 |
| PUT | `/api/todos/{id}` | タスク更新（テキスト変更・完了状態切り替え） |
| DELETE | `/api/todos/{id}` | タスク削除 |
| DELETE | `/api/todos/completed` | 完了済み一括削除 |

### データモデル

既存の `functional-design.md` のデータモデルをそのままDBのスキーマとして使用する。

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | UUID | ✓ | 一意識別子（サーバー側で採番） |
| text | string（1〜200文字） | ✓ | タスクの内容 |
| completed | boolean | ✓ | 完了状態（デフォルト: false） |
| createdAt | datetime | ✓ | 作成日時（UTC、サーバー側で採番） |

### バリデーション

- `text`: 必須・空文字不可・最大200文字
- `id`: PUT/DELETE時に存在確認（存在しない場合は404を返す）

---

## 4. 非機能要件

- レスポンスタイム：各APIエンドポイント 200ms以内（ローカル環境）
- CORS：フロントエンド（`http://localhost:5173`）からのリクエストを許可
- エラーレスポンス：適切なHTTPステータスコードとエラーメッセージを返す
- 認証：v1.0スコープ外（将来 AWS Cognito + JWT を追加予定）

---

## 5. 技術スタック

`docs/architecture.md` に定義済みの内容に従う。

| 項目 | 技術 |
|------|------|
| 言語 | C# / .NET 9 |
| フレームワーク | ASP.NET Core Web API |
| ORM | Entity Framework Core |
| DB | PostgreSQL |
| コンテナ | Docker（マルチステージビルド） |

---

## 6. 受け入れ条件

- [ ] `GET /api/todos` でタスク一覧がJSON配列で返る
- [ ] `POST /api/todos` でタスクが作成され、作成されたTodoが返る
- [ ] `PUT /api/todos/{id}` でタスクが更新され、更新後のTodoが返る
- [ ] `DELETE /api/todos/{id}` でタスクが削除され、204が返る
- [ ] `DELETE /api/todos/completed` で完了済みタスクが一括削除され、204が返る
- [ ] 存在しないIDへのPUT/DELETEは404を返す
- [ ] 空テキストでのPOSTは400を返す
- [ ] フロントエンドからAPIが呼び出せる（CORS設定済み）
- [ ] `docker compose up` で全サービス（frontend / backend / db）が起動する

---

## 7. スコープ外

- ユーザー認証・認可（将来追加）
- 本番環境へのデプロイ（ECS Fargate / RDS）（将来追加）
- フロントエンドのAPI連携（`storage.ts` → `api.ts` への切り替え）は別タスクで実施
