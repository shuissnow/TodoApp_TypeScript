# tasklist.md — バックエンド追加

**作成日:** 2026-03-28
**対象ステアリング:** `.steering/20260328-add-backend/`

---

## タスク一覧

### Phase 1: プロジェクト基盤

- [ ] **T-01** `backend/` ディレクトリに .NET 9 Web API プロジェクトを作成する
  - `TodoApp.sln`、`TodoApp.Api.csproj`、`TodoApp.Api.Tests.csproj` を生成
  - 必要なNuGetパッケージを追加（EF Core, Npgsql, etc.）

- [ ] **T-02** `backend/Dockerfile` を作成する
  - マルチステージビルド（sdk:9.0 → aspnet:9.0）

- [ ] **T-03** `docker-compose.yml` に `backend` と `db` サービスを追加する

### Phase 2: データ層

- [ ] **T-04** `Todo.cs`（エンティティ）を作成する

- [ ] **T-05** `AppDbContext.cs` を作成する

- [ ] **T-06** EF Core マイグレーションを作成・適用する
  - 初期マイグレーション生成
  - `Program.cs` で起動時自動マイグレーション設定

### Phase 3: リポジトリ層

- [ ] **T-07** `ITodoRepository.cs` を作成する

- [ ] **T-08** `TodoRepository.cs` を実装する

### Phase 4: サービス層

- [ ] **T-09** `ITodoService.cs` を作成する

- [ ] **T-10** `TodoService.cs` を実装する

- [ ] **T-11** `TodoService` の単体テストを作成・実行する

### Phase 5: API層

- [ ] **T-12** `CreateTodoRequest.cs`、`UpdateTodoRequest.cs`（DTOs）を作成する

- [ ] **T-13** `TodosController.cs` を実装する

### Phase 6: 設定・統合

- [ ] **T-14** `Program.cs` にDI登録・CORS・DB接続を設定する

- [ ] **T-15** `docker compose up` で全サービス起動を確認する

- [ ] **T-16** 各APIエンドポイントの動作確認（curl または HTTPie）

---

## 完了条件

- `docker compose up` で frontend / backend / db の全サービスが起動する
- 全APIエンドポイント（5本）が正常に動作する
- TodoService の単体テストがすべてパスする
- 存在しないIDへのアクセスで404が返る
- 空テキストでのPOSTで400が返る
