# design.md — バックエンド追加

**作成日:** 2026-03-28
**対象ステアリング:** `.steering/20260328-add-backend/`

---

## 1. ディレクトリ構成

```
backend/
├── src/
│   └── TodoApp.Api/
│       ├── Controllers/
│       │   └── TodosController.cs      # APIエンドポイント定義
│       ├── Models/
│       │   └── Todo.cs                 # Todoエンティティ
│       ├── DTOs/
│       │   ├── CreateTodoRequest.cs    # POST リクエストボディ
│       │   └── UpdateTodoRequest.cs    # PUT リクエストボディ
│       ├── Services/
│       │   ├── ITodoService.cs         # サービスインターフェース
│       │   └── TodoService.cs          # ビジネスロジック
│       ├── Repositories/
│       │   ├── ITodoRepository.cs      # リポジトリインターフェース
│       │   └── TodoRepository.cs       # EF Core を使ったDBアクセス
│       ├── Data/
│       │   └── AppDbContext.cs         # EF Core DbContext
│       ├── Program.cs                  # アプリケーション起動・DI設定
│       └── appsettings.json            # 設定ファイル（接続文字列など）
├── tests/
│   └── TodoApp.Api.Tests/
│       ├── Services/
│       │   └── TodoServiceTests.cs     # TodoService の単体テスト
│       └── TodoApp.Api.Tests.csproj
├── TodoApp.sln
└── Dockerfile
```

---

## 2. アーキテクチャ

### レイヤー構成

```
Controller（HTTP層）
    ↓ DTOs
Service（ビジネスロジック層）
    ↓ Entities
Repository（データアクセス層）
    ↓
AppDbContext（EF Core）
    ↓
PostgreSQL
```

- **Controller**: HTTPリクエストの受け取り・レスポンス返却のみ。ロジックは持たない。
- **Service**: バリデーションとビジネスロジックを担当。
- **Repository**: DBアクセスをカプセル化。EF Coreを直接触るのはここだけ。
- **DTOs**: Controller/Serviceのレイヤー間でデータを受け渡す。エンティティをそのまま外部に公開しない。

---

## 3. データモデル

### エンティティ: `Todo`

```csharp
public class Todo
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool Completed { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

### DBテーブル: `todos`

| カラム | 型 | 制約 |
|--------|-----|------|
| id | UUID | PRIMARY KEY |
| text | VARCHAR(200) | NOT NULL |
| completed | BOOLEAN | NOT NULL, DEFAULT false |
| created_at | TIMESTAMPTZ | NOT NULL |

---

## 4. API設計

### レスポンス形式

すべてのエンドポイントはJSON形式で返す。

**Todoオブジェクト（レスポンス）**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "text": "買い物に行く",
  "completed": false,
  "createdAt": "2026-03-28T09:00:00.000Z"
}
```

### エンドポイント詳細

#### `GET /api/todos`
- 成功: `200 OK` + `Todo[]`
- DBの全Todoを `createdAt` 昇順で返す

#### `POST /api/todos`
- リクエスト: `{ "text": "string" }`
- 成功: `201 Created` + 作成した`Todo`
- バリデーションエラー: `400 Bad Request`

#### `PUT /api/todos/{id}`
- リクエスト: `{ "text": "string", "completed": boolean }`（両フィールドとも省略可）
- 成功: `200 OK` + 更新後の`Todo`
- 未存在: `404 Not Found`

#### `DELETE /api/todos/{id}`
- 成功: `204 No Content`
- 未存在: `404 Not Found`

#### `DELETE /api/todos/completed`
- 成功: `204 No Content`（対象0件でも204）

---

## 5. DTOs

```csharp
// POST /api/todos
public class CreateTodoRequest
{
    public string Text { get; set; } = string.Empty;
}

// PUT /api/todos/{id}
public class UpdateTodoRequest
{
    public string? Text { get; set; }
    public bool? Completed { get; set; }
}
```

---

## 6. CORS設定

開発環境でフロントエンド（`http://localhost:5173`）からのリクエストを許可する。

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

---

## 7. Docker構成

### `backend/Dockerfile`（マルチステージビルド）

```
Stage 1: builder
  - mcr.microsoft.com/dotnet/sdk:9.0
  - dotnet publish -c Release

Stage 2: production
  - mcr.microsoft.com/dotnet/aspnet:9.0
  - publishされたバイナリをコピー
  - EXPOSE 8080
```

### `docker-compose.yml` 更新内容

```yaml
services:
  frontend:
    # 既存設定（変更なし）

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - ConnectionStrings__DefaultConnection=Host=db;Database=todoapp;Username=postgres;Password=postgres
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: todoapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

---

## 8. EF Core マイグレーション方針

- マイグレーションファイルはソースコードとしてリポジトリに含める
- 初回起動時に `Program.cs` で `context.Database.Migrate()` を自動実行する

---

## 9. 影響範囲

### `docs/` への影響
- `architecture.md`：バックエンド追加に伴い、システム構成図を将来構成に更新が必要（別途実施）
- `functional-design.md`：システム構成図の更新が必要（別途実施）

### フロントエンドへの影響
- 本タスクではフロントエンドは変更しない
- `storage.ts` → `api.ts` の切り替えは別タスクとして実施する
