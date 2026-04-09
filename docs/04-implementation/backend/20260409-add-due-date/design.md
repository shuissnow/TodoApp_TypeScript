# design.md — 期限日（due_date）機能の追加（バックエンド）

**作成日:** 2026-04-09

---

## 1. 実装アプローチ

既存のレイヤードアーキテクチャ（Controller → Service → Repository → DbContext）に沿って変更を加える。
フィルタ・ソート条件はクエリパラメータ DTO（`TodoQueryParams`）として受け取り、Repository 層で DB クエリに変換する。

---

## 2. データ構造の変更

### 2.1 Todo エンティティ（`Models/Todo.cs`）

```csharp
// 追加
public DateOnly? DueDate { get; set; }
```

- `DateOnly` は .NET 6 以降の標準型。Npgsql が PostgreSQL の `date` 型にネイティブマッピングする（変換不要）
- JSON シリアライズ時は `"dueDate": "2026-04-30"` の形式（ASP.NET Core の camelCase 設定による）

### 2.2 DBスキーマ（`Data/AppDbContext.cs` + マイグレーション）

`OnModelCreating` に追加:

```csharp
entity.Property(e => e.DueDate)
      .HasColumnName("due_date")
      .HasColumnType("date")
      .IsRequired(false);
```

マイグレーションで追加される列:

| カラム名 | 型 | NULL | デフォルト |
|---------|-----|------|---------|
| `due_date` | date | 許可 | NULL |

既存データへの影響: 既存行の `due_date` は `NULL`（期限なし）になる。バックフィル不要。

---

## 3. 変更するコンポーネント

### 3.1 新規作成

| ファイル | 内容 |
|---------|------|
| `DTOs/TodoQueryParams.cs` | フィルタ・ソートのクエリパラメータ DTO |

### 3.2 変更

| ファイル | 変更内容 |
|---------|---------|
| `Models/Todo.cs` | `DateOnly? DueDate` プロパティを追加 |
| `Data/AppDbContext.cs` | `due_date` カラムの設定を追加 |
| `DTOs/CreateTodoRequest.cs` | `DateOnly? DueDate` を追加 |
| `DTOs/UpdateTodoRequest.cs` | `DateOnly? DueDate` と `bool ResetDueDate` を追加 |
| `Repositories/ITodoRepository.cs` | `GetAllAsync` の引数に `TodoQueryParams` を追加 |
| `Repositories/TodoRepository.cs` | フィルタ・ソートの LINQ クエリを実装 |
| `Services/ITodoService.cs` | `GetAllAsync` の引数に `TodoQueryParams` を追加 |
| `Services/TodoService.cs` | `GetAllAsync` / `CreateAsync` / `UpdateAsync` を更新 |
| `Controllers/TodosController.cs` | `GetAllAsync` に `[FromQuery] TodoQueryParams` を追加 |

---

## 4. 実装詳細

### 4.1 `TodoQueryParams` DTO（新規）

```csharp
public class TodoQueryParams
{
    public string? Filter { get; set; }  // today | overdue | this_week | has_due_date | no_due_date
    public string? Sort { get; set; }    // due_date
}
```

`string?` を使う理由: 将来の複合ソート（`?sort=due_date,priority` など）を文字列パースで吸収できる。

### 4.2 Repository のフィルタ・ソート実装

```csharp
public async Task<IEnumerable<Todo>> GetAllAsync(TodoQueryParams queryParams)
{
    var today = DateOnly.FromDateTime(DateTime.UtcNow);

    IQueryable<Todo> query = context.Todos;

    query = queryParams.Filter switch
    {
        "today"        => query.Where(t => t.DueDate == today),
        "overdue"      => query.Where(t => t.DueDate != null && t.DueDate < today),
        "this_week"    => query.Where(t => t.DueDate >= today && t.DueDate <= today.AddDays(6)),
        "has_due_date" => query.Where(t => t.DueDate != null),
        "no_due_date"  => query.Where(t => t.DueDate == null),
        _              => query,
    };

    query = queryParams.Sort switch
    {
        "due_date" => query.OrderBy(t => t.DueDate == null)   // false(0)=先, true(1)=後 → nulls last
                          .ThenBy(t => t.DueDate)
                          .ThenBy(t => t.CreatedAt),
        _          => query.OrderBy(t => t.CreatedAt),
    };

    return await query.ToListAsync();
}
```

**nulls last の仕組み:** `OrderBy(t => t.DueDate == null)` は EF Core により SQL の `CASE WHEN due_date IS NULL THEN TRUE ELSE FALSE END` に変換される。PostgreSQL では `false < true` のため、非 null（false）が先に並ぶ。

### 4.3 `UpdateTodoRequest` の `ResetDueDate` フラグ

`DateOnly?` は JSON で `null` を受け取った場合と「フィールド未指定」を区別できない。そのため `ResetDueDate` フラグで明示的にリセットを指示する。

| リクエスト | 動作 |
|-----------|------|
| `"dueDate": "2026-04-30"` | 期限日を設定 |
| `"resetDueDate": true` | 期限日を null にリセット |
| どちらも未指定 | 期限日を変更しない |

Service 側の実装:

```csharp
if (request.ResetDueDate) todo.DueDate = null;
else if (request.DueDate is not null) todo.DueDate = request.DueDate;
```

---

## 5. 影響範囲の分析

| 項目 | 影響 |
|------|------|
| 既存 API レスポンス | `dueDate` フィールドが追加される（null）。後方互換性あり |
| 既存データ | `due_date` は `NULL`。既存動作に変化なし |
| 既存テスト | `GetAllAsync` のモック・呼び出しを `TodoQueryParams` 引数付きに変更が必要 |
| フロントエンド | `dueDate` フィールドを受け取れるが、利用するかは後続の FE 作業単位で対応 |

---

## 6. マイグレーション手順

```bash
cd src/backend
dotnet ef migrations add AddDueDateToTodo \
  --project src/TodoApp.Api \
  --startup-project src/TodoApp.Api

dotnet ef database update \
  --project src/TodoApp.Api \
  --startup-project src/TodoApp.Api
```

ロールバック時は `dotnet ef database update <前のマイグレーション名>` で差し戻し可能。
