# tasklist.md — ログイン機能追加（バックエンド）

## タスク一覧

### 1. モデル・データ層

- [x] `Models/User.cs` 新規作成
- [x] `Models/Todo.cs` に `UserId` / `User` ナビゲーションプロパティ追加
- [x] `Data/AppDbContext.cs` に `DbSet<User>` 追加・Fluent API 設定・Todo への UserId FK 設定

### 2. マイグレーション

- [x] `dotnet ef migrations add AddUserAndTodoUserId` 実行
- [x] 生成されたマイグレーション内容を確認（Up/Down）

### 3. リポジトリ層

- [x] `Repositories/IUserRepository.cs` 新規作成（`FindByUsernameAsync` / `ExistsAsync` / `CreateAsync`）
- [x] `Repositories/UserRepository.cs` 新規作成
- [x] `Repositories/ITodoRepository.cs` の全メソッドに `int userId` パラメータを追加
- [x] `Repositories/TodoRepository.cs` の全クエリに UserId フィルタを追加（`CreateAsync` で `UserId` セットも含む）

### 4. サービス層

- [x] `Services/IAuthService.cs` 新規作成（`ValidateAsync` / `SeedAdminUserAsync`）
- [x] `Services/AuthService.cs` 新規作成
- [x] `Services/ITodoService.cs` の全メソッドに `int userId` パラメータを追加
- [x] `Services/TodoService.cs` の全メソッドに `userId` を追加してリポジトリに委譲

### 5. コントローラー・DTO 層

- [x] `DTOs/LoginRequest.cs` 新規作成
- [x] `DTOs/MeResponse.cs` 新規作成
- [x] `Controllers/AuthController.cs` 新規作成（`POST /api/auth/login` / `POST /api/auth/logout` / `GET /api/auth/me`）
- [x] `Controllers/TodosController.cs` にクラスレベルの `[Authorize]` 追加・各アクションで Claim から `userId` を取得してサービスに渡す

### 6. Program.cs・設定ファイル

- [x] `appsettings.Development.json` に `SeedUser`（Username / Password）セクションを追加
- [x] `Program.cs` に Cookie 認証設定（`AddAuthentication().AddCookie()`）を追加
- [x] `Program.cs` に `AddAuthorization()` を追加
- [x] `Program.cs` の DI 登録に `IUserRepository` / `IAuthService` を追加
- [x] `Program.cs` の CORS 設定に `AllowCredentials()` を追加
- [x] `Program.cs` のミドルウェアに `UseAuthentication()` / `UseAuthorization()` を追加
- [x] `Program.cs` の起動時処理に `SeedAdminUserAsync()` の呼び出しを追加

### 7. テスト

- [-] 既存テスト（TodoServiceTests）の全メソッドに `userId` パラメータを追加して修正（スキップ）
- [-] 既存テスト（TodosControllerTests）に `ClaimsPrincipal` セットアップを追加して修正（スキップ）

### 8. 動作確認

- [ ] `dotnet build` でビルドエラーなし
- [ ] Docker 再起動 or `dotnet run` で DB 適用・シードユーザー自動作成を確認
- [ ] Scalar UI で `POST /api/auth/login` → `200 OK + Set-Cookie` を確認
- [ ] Scalar UI で `GET /api/auth/me`（Cookie あり）→ `{ id, username }` を確認
- [ ] Scalar UI で `GET /api/todos`（Cookie なし）→ `401 Unauthorized` を確認
- [ ] `dotnet test` で全テストパス

## 完了条件

- 全タスクが完了していること
- `dotnet build` / `dotnet test` がエラーなしでパスすること
