# Backend

ASP.NET Core Web API (.NET 9) + Entity Framework Core + PostgreSQL で構築したバックエンドです。

---

## フォルダ構成

```
backend/
├── src/
│   └── TodoApp.Api/
│       ├── Controllers/    # HTTPリクエストの入口
│       ├── Services/       # ビジネスロジック
│       ├── Repositories/   # DBアクセス
│       ├── Models/         # DBエンティティ
│       ├── DTOs/           # リクエスト/レスポンス定義
│       ├── Data/           # DbContext・マイグレーション
│       └── Program.cs      # 起動設定・DI登録
└── tests/
    └── TodoApp.Api.Tests/  # 単体テスト
```

---

## ローカル起動（Docker なし）

事前に PostgreSQL が起動していること。

```bash
cd src/backend/src/TodoApp.Api

# 接続文字列を環境変数で上書き（必要な場合）
export ConnectionStrings__DefaultConnection="Host=localhost;Database=todoapp;Username=postgres;Password=postgres"

dotnet run
```

起動後、`http://localhost:8080` でアクセス可能。

---

## テスト

```bash
cd src/backend
dotnet test
```

---

## マイグレーション

```bash
cd src/backend/src/TodoApp.Api

# マイグレーションファイルを生成
dotnet ef migrations add <MigrationName>

# DBに適用
dotnet ef database update
```

> アプリ起動時に自動でマイグレーションが適用されます（`Program.cs` で設定済み）。

---

## API エンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/todos` | 一覧取得 |
| POST | `/api/todos` | 新規作成 |
| PUT | `/api/todos/{id}` | 更新（テキスト・完了状態） |
| DELETE | `/api/todos/{id}` | 削除 |

---

## 技術解説

アーキテクチャ・DI・リクエストフローの詳細は以下を参照してください。

[docs/03-detailed-design/backend-architecture.md](../../docs/03-detailed-design/backend-architecture.md)
