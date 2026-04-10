# design.md — 優先度機能追加（バックエンド）

## 実装アプローチ

既存のアーキテクチャ（Controllers → Services → Repositories → DbContext）に沿って実装する。
優先度専用のエンドポイント（`GET /api/priorities`）は読み取り専用のシンプルな構成とし、
新規に `PrioritiesController` / `IPriorityRepository` / `PriorityRepository` を追加する。

## 変更するコンポーネント

### 新規作成

| ファイル | 内容 |
|---------|------|
| `Models/Priority.cs` | `Priority` エンティティ |
| `Repositories/IPriorityRepository.cs` | 優先度リポジトリ インターフェース |
| `Repositories/PriorityRepository.cs` | 優先度リポジトリ 実装 |
| `Controllers/PrioritiesController.cs` | `GET /api/priorities` エンドポイント |

### 修正

| ファイル | 変更内容 |
|---------|---------|
| `Models/Todo.cs` | `string? PriorityId` / `Priority? Priority` ナビゲーション追加 |
| `Data/AppDbContext.cs` | priorities テーブルのマッピング・seed・todos へのFK設定、`DbSet<Priority>` 追加 |
| `DTOs/CreateTodoRequest.cs` | `string? PriorityId` 追加 |
| `DTOs/UpdateTodoRequest.cs` | `string? PriorityId` 追加 |
| `Services/TodoService.cs` | Create/Update で `PriorityId` を反映 |
| `Repositories/TodoRepository.cs` | `GetAllAsync` / `GetByIdAsync` に `.Include(t => t.Priority)` 追加 |
| `Program.cs` | `PriorityRepository` をDIコンテナに登録 |

## データ構造の変更

### 新規: priorities テーブル

```
priorities
  id               char(3)      PK  ("001", "002", "003", ...)
  name             varchar(50)  NOT NULL
  foreground_color varchar(7)   NOT NULL  (例: "#EF4444")
  background_color varchar(7)   NOT NULL  (例: "#FEE2E2")
  display_order    integer      NOT NULL
  is_deleted       boolean      NOT NULL  DEFAULT false
  created_at       timestamptz  NOT NULL
```

### 変更: todos テーブル

```
todos
  priority_id  char(3)  NULL  FK → priorities.id  ON DELETE SET NULL
```

### Priority.cs モデル

```csharp
public class Priority
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ForegroundColor { get; set; } = string.Empty;
    public string BackgroundColor { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<Todo> Todos { get; set; } = [];
}
```

### Todo.cs への追加

```csharp
public string? PriorityId { get; set; }
public Priority? Priority { get; set; }
```

## APIレスポンス設計

### GET /api/priorities

```json
[
  { "id": "001", "name": "高", "foregroundColor": "#EF4444", "backgroundColor": "#FEE2E2", "displayOrder": 1 },
  { "id": "002", "name": "中", "foregroundColor": "#F97316", "backgroundColor": "#FFEDD5", "displayOrder": 2 },
  { "id": "003", "name": "低", "foregroundColor": "#3B82F6", "backgroundColor": "#DBEAFE", "displayOrder": 3 }
]
```

`is_deleted` / `created_at` はレスポンスに含めない（エンティティを直接返さずDTOを使うか、JSON無視属性を付与）。

### GET /api/todos（変更後のレスポンス例）

```json
[
  {
    "id": 1,
    "text": "タスク名",
    "completed": false,
    "createdAt": "2026-04-10T00:00:00Z",
    "dueDate": null,
    "priority": {
      "id": "001",
      "name": "高",
      "foregroundColor": "#EF4444",
      "backgroundColor": "#FEE2E2"
    }
  }
]
```

## 影響範囲の分析

| 対象 | 影響 | 対応 |
|------|------|------|
| 既存Todo（priority_id=NULL） | priority フィールドが null で返る | フロントはnullを「低」扱いで表示 |
| 既存テスト（TodoServiceTests） | CreateAsync/UpdateAsync のモック設定追加が必要 | priority関連ケースを追加 |
| 既存テスト（TodosControllerTests） | 変更なし（Serviceに委譲するだけ） | 影響なし |
| マイグレーション | 新テーブル作成 + todos へのカラム追加 | `AddPriorityFeature` 1本で実施 |
