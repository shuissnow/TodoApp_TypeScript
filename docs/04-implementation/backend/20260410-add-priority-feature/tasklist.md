# tasklist.md — 優先度機能追加（バックエンド）

## タスク一覧

### 1. モデル・データ層

- [ ] `Models/Priority.cs` 新規作成
- [ ] `Models/Todo.cs` に `PriorityId` / `Priority` 追加
- [ ] `Data/AppDbContext.cs` に priorities マッピング・seed・FK設定追加

### 2. マイグレーション

- [ ] `dotnet ef migrations add AddPriorityFeature` 実行
- [ ] 生成されたマイグレーションに部分インデックスの raw SQL を手動追加
- [ ] マイグレーション内容を確認（Up/Down）

### 3. リポジトリ層

- [ ] `Repositories/IPriorityRepository.cs` 新規作成
- [ ] `Repositories/PriorityRepository.cs` 新規作成
- [ ] `Repositories/TodoRepository.cs` の `GetAllAsync` / `GetByIdAsync` に `.Include(t => t.Priority)` 追加

### 4. サービス・コントローラー層

- [ ] `DTOs/CreateTodoRequest.cs` に `string? PriorityId` 追加
- [ ] `DTOs/UpdateTodoRequest.cs` に `string? PriorityId` 追加
- [ ] `Services/TodoService.cs` の Create/Update に `PriorityId` 反映
- [ ] `Controllers/PrioritiesController.cs` 新規作成（`GET /api/priorities`）
- [ ] `Program.cs` に `PriorityRepository` をDI登録

### 5. テスト

- [ ] `Tests/Services/TodoServiceTests.cs` に priority 関連テスト追加

### 6. 動作確認

- [ ] `dotnet build` でビルドエラーなし
- [ ] Docker再起動 or `dotnet run` でDB適用・seed確認
- [ ] Scalar UI で `GET /api/priorities` → 3件返ることを確認
- [ ] Scalar UI で `POST /api/todos` に priorityId 指定 → レスポンスに priority がネストされることを確認
- [ ] Scalar UI で priorityId 省略 → priority が null になることを確認
- [ ] `dotnet test` で全テストパス

## 完了条件

- 全タスクが完了していること
- `dotnet build` / `dotnet test` がエラーなしでパスすること
