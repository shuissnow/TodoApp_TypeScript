# design.md — ログイン機能追加（バックエンド）

## 実装アプローチ

既存のアーキテクチャ（Controllers → Services → Repositories → DbContext）に沿って実装する。
Cookie 認証は ASP.NET Core 標準の `AddAuthentication().AddCookie()` を使用する。
パスワードは `Microsoft.AspNetCore.Identity.PasswordHasher<User>` でハッシュ化する（追加 NuGet パッケージ不要）。

## 変更するコンポーネント

### 新規作成

| ファイル | 内容 |
|----------|------|
| `Models/User.cs` | User エンティティ |
| `Repositories/IUserRepository.cs` | ユーザーリポジトリ インターフェース |
| `Repositories/UserRepository.cs` | ユーザーリポジトリ 実装 |
| `Services/IAuthService.cs` | 認証サービス インターフェース |
| `Services/AuthService.cs` | 認証サービス 実装 |
| `Controllers/AuthController.cs` | 認証 API コントローラー |
| `DTOs/LoginRequest.cs` | ログインリクエスト DTO |
| `DTOs/MeResponse.cs` | ログイン中ユーザー情報 DTO |

### 修正

| ファイル | 変更内容 |
|----------|----------|
| `Models/Todo.cs` | `int? UserId` と `User? User` ナビゲーションプロパティを追加 |
| `Data/AppDbContext.cs` | `DbSet<User>` 追加、User の Fluent API 設定、Todo への UserId FK 設定 |
| `Repositories/ITodoRepository.cs` | 全メソッドに `int userId` パラメータを追加 |
| `Repositories/TodoRepository.cs` | 全クエリに UserId フィルタを追加 |
| `Services/ITodoService.cs` | 全メソッドに `int userId` パラメータを追加 |
| `Services/TodoService.cs` | `userId` をリポジトリに委譲 |
| `Controllers/TodosController.cs` | クラスに `[Authorize]` 追加、Claim から userId を取得してサービスに渡す |
| `Program.cs` | 認証設定・DI 登録・CORS 変更・ミドルウェア追加・シードユーザー作成 |
| `appsettings.Development.json` | `SeedUser` セクション（Username / Password）を追加 |

## データ構造の変更

### 新規: users テーブル

```
users
  id             integer      PK  IDENTITY
  username       varchar(50)  NOT NULL  UNIQUE
  password_hash  varchar(256) NOT NULL
  created_at     timestamptz  NOT NULL
```

### 変更: todos テーブル

```
todos
  user_id  integer  NULL  FK → users.id  ON DELETE CASCADE
```

> nullable にする理由: マイグレーション時に既存行へシードユーザー ID を UPDATE してから FK 制約を付ける。将来的なユーザー追加を妨げないよう NOT NULL 制約は付けない。

### User.cs モデル

```csharp
public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public ICollection<Todo> Todos { get; set; } = [];
}
```

### Todo.cs への追加

```csharp
public int? UserId { get; set; }
public User? User { get; set; }
```

## API 設計

### POST `/api/auth/login`

- リクエスト: `{ "username": "admin", "password": "P@ssw0rd!" }`
- 処理: `AuthService.ValidateAsync` でパスワード検証 → `HttpContext.SignInAsync` で Cookie 発行
- 成功時: `200 OK` + `{ "id": 1, "username": "admin" }` + `Set-Cookie: todo_session=...`
- 失敗時: `401 Unauthorized`

### POST `/api/auth/logout`

- 認証: `[Authorize]` 必須
- 処理: `HttpContext.SignOutAsync` で Cookie 削除
- レスポンス: `204 No Content`

### GET `/api/auth/me`

- 認証: `[Authorize]` 必須
- 処理: Claim から `NameIdentifier`（Id）と `Name`（Username）を取得
- レスポンス: `200 OK` + `{ "id": 1, "username": "admin" }`

## Program.cs の変更内容

### 認証設定（`AddControllers()` の前に追加）

```csharp
builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "todo_session";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;
        // API として使うため 302 リダイレクトを 401 に変換する
        options.Events.OnRedirectToLogin = ctx =>
        {
            ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = ctx =>
        {
            ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });
builder.Services.AddAuthorization();
```

### DI 追加

```csharp
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
```

### CORS 変更（`AllowCredentials()` を追加）

```csharp
policy.WithOrigins("http://localhost:5173")
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowCredentials();
```

### ミドルウェア（`MapControllers()` の前に追加）

```csharp
app.UseAuthentication();
app.UseAuthorization();
```

### シードユーザー作成（`Migrate()` の直後）

```csharp
IAuthService authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
await authService.SeedAdminUserAsync();
```

## マイグレーション戦略

マイグレーション名: `AddUserAndTodoUserId`

Up() の処理順序:
1. `users` テーブル作成
2. `todos.user_id` カラム追加（nullable）
3. 既存 Todo 行をシードユーザーへ移行する生 SQL

```csharp
migrationBuilder.Sql(@"
    INSERT INTO users (username, password_hash, created_at)
    VALUES ('admin', '__PLACEHOLDER__', NOW())
    ON CONFLICT (username) DO NOTHING;

    UPDATE todos
    SET user_id = (SELECT id FROM users WHERE username = 'admin')
    WHERE user_id IS NULL;
");
```

> `__PLACEHOLDER__` のパスワードハッシュは `SeedAdminUserAsync` で上書きされるため、マイグレーション内では仮値で問題ない。実際はシードを `Program.cs` の起動時処理に任せ、マイグレーションでは `user_id` の UPDATE のみを生 SQL で行う（INSERT は `SeedAdminUserAsync` に委譲する）。

実際のマイグレーションでは:
1. `users` テーブル作成（空）
2. `todos.user_id` カラム追加（nullable）
3. FK・インデックス追加

アプリ起動時（`Program.cs`）:
4. `SeedAdminUserAsync` でユーザー存在確認 → 未存在なら作成
5. この時点で Todo の `user_id` は NULL のままだが、既存データへの遡及更新は手動またはスクリプトで対応

> 既存データの `user_id` 移行が必要な場合は、シード実行後に `UPDATE todos SET user_id = 1 WHERE user_id IS NULL` を手動実行するか、`SeedAdminUserAsync` 内で実施する。

## 影響範囲の分析

| 対象 | 影響 | 対応 |
|------|------|------|
| 既存 Todo（user_id=NULL） | ログイン後に表示されない | マイグレーション or シード後に UPDATE で移行 |
| 既存テスト（TodoServiceTests） | `userId` パラメータ追加により変更が必要 | 全テストに `userId` を渡すよう修正 |
| 既存テスト（TodosControllerTests） | `User.FindFirstValue` のモックが必要 | ClaimsPrincipal をセットアップするヘルパーを追加 |
| PrioritiesController | 変更なし（全ユーザー共通） | 影響なし |
