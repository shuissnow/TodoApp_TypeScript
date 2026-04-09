# tasklist.md — 期限日（due_date）機能の追加（バックエンド）

**作成日:** 2026-04-09

---

## タスク一覧

### 1. モデル・スキーマ変更

- [x] `Models/Todo.cs` に `DateOnly? DueDate` プロパティを追加
- [x] `Data/AppDbContext.cs` の `OnModelCreating` に `due_date` カラム設定を追加
- [x] EF Core マイグレーションを作成（`AddDueDateToTodo`）
- [ ] マイグレーションを DB に適用（`dotnet ef database update`）

### 2. DTO 追加・変更

- [x] `DTOs/TodoQueryParams.cs` を新規作成（`Filter`, `Sort` プロパティ）
- [x] `DTOs/CreateTodoRequest.cs` に `DateOnly? DueDate` を追加
- [x] `DTOs/UpdateTodoRequest.cs` に `DateOnly? DueDate` と `bool? ResetDueDate` を追加

### 3. Repository 変更

- [x] `Repositories/ITodoRepository.cs` の `GetAllAsync` 引数に `TodoQueryParams` を追加
- [x] `Repositories/TodoRepository.cs` の `GetAllAsync` にフィルタ・ソートの LINQ クエリを実装

### 4. Service 変更

- [x] `Services/ITodoService.cs` の `GetAllAsync` 引数に `TodoQueryParams` を追加
- [x] `Services/TodoService.cs` の `GetAllAsync` を更新（`TodoQueryParams` を Repository に委譲）
- [x] `Services/TodoService.cs` の `CreateAsync` に `DueDate = request.DueDate` を追加
- [x] `Services/TodoService.cs` の `UpdateAsync` に `ResetDueDate` / `DueDate` の更新ロジックを追加

### 5. Controller 変更

- [x] `Controllers/TodosController.cs` の `GetAllAsync` に `[FromQuery] TodoQueryParams queryParams` を追加

### 6. 既存テスト修正

- [x] `Tests/Services/TodoServiceTests.cs` の `GetAllAsync` 系テストのモック・呼び出しを `TodoQueryParams` 引数付きに変更
- [x] `Tests/Controllers/TodosControllerTests.cs` の `GetAll_*` テストのモック・呼び出しを `TodoQueryParams` 引数付きに変更

### 7. 新規テスト追加

- [x] `Tests/Services/TodoServiceTests.cs` に以下を追加:
  - `CreateAsync_SetsDueDateFromRequest`
  - `CreateAsync_SetsDueDateToNull_WhenDueDateNotProvided`
  - `UpdateAsync_SetsDueDate_WhenDueDateProvided`
  - `UpdateAsync_ResetsDueDateToNull_WhenResetDueDateIsTrue`
  - `UpdateAsync_DoesNotChangeDueDate_WhenNeitherFlagNorValueProvided`
- [x] `Tests/Controllers/TodosControllerTests.cs` に以下を追加:
  - `GetAll_PassesQueryParamsToService`

### 8. 動作確認

- [x] `dotnet build` でビルドエラーなし
- [x] `dotnet test` で全テストパス（26件）
- [ ] Scalar UI（`http://localhost:5243/scalar/v1`）で以下を手動確認:
  - `POST /api/todos` に `dueDate` を含めて作成できる
  - `PUT /api/todos/{id}` で `dueDate` を更新できる
  - `PUT /api/todos/{id}` で `resetDueDate: true` により期限日が null になる
  - `GET /api/todos?filter=overdue` で期限切れのみ返る
  - `GET /api/todos?sort=due_date` で期限日昇順・nulls last で返る

---

## 完了条件

`requirements.md` の受け入れ条件がすべてチェックされていること。
