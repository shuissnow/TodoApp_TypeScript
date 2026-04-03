# CLAUDE.md (プロジェクトメモリ)

## 概要

backend開発を進めるうえで遵守すべき標準ルールを定義します。

## プロジェクト構造

```
src/TodoApp.Api/
├── Controllers/   # APIエンドポイント
├── DTOs/          # リクエスト・レスポンス DTO
├── Data/          # DBコンテキスト・マイグレーション
├── Models/        # エンティティ
├── Repositories/  # DBアクセス（インターフェース + 実装）
├── Services/      # ビジネスロジック（インターフェース + 実装）
└── Program.cs     # エントリーポイント・DI設定

tests/TodoApp.Api.Tests/
└── Services/      # テストコード（src/ と同じ構成）
```

- ビジネスロジックは `Services/` に集約し、`Controllers/` に直接書かない
- DBアクセスは `Repositories/` に集約し、`Services/` から直接 `DbContext` を呼ばない
- インターフェースと実装は同一ディレクトリに配置する

---

## 技術スタック

- **言語:** C# / .NET 9
- **フレームワーク:** ASP.NET Core Web API
- **ORM:** Entity Framework Core 9
- **DB:** PostgreSQL（Npgsql）
- **テスト:** xUnit + Moq
- **API ドキュメント:** Microsoft.AspNetCore.OpenApi + Scalar.AspNetCore

---

## 作業単位

- 一度に複数ファイルを作成するのではなく最大1ファイルを作成するようにしてください。
- 一度の作業で複数のメソッドを作成するのではなく、最大一つのメソッドを作成するようにしてください。またメソッドを作成し終えた段階で承認を得るようにしてください。
- メソッドを作成するときは、以下の内容を踏まえてください。
  1. コーディング規約に従ってメソッドを記述する。
  2. 単体テストを書きやすいように依存性注入を活用する。
- 承認後、以下をこの順番で行ってください：
  1. ビルドを実行しエラーがないことを確認する。
  2. 単体テスト方針に従ってテストを作成する。
  3. 単体テストを実行する。

---

## コーディング規約

Microsoft の [C# コーディング規約](https://learn.microsoft.com/ja-jp/dotnet/csharp/fundamentals/coding-style/coding-conventions) に準拠します。
以下はプロジェクト固有の補足ルールです。

### 命名規則

| 対象 | 規則 | 例 |
|------|------|----|
| クラス・メソッド・プロパティ | パスカルケース | `TodoService`, `GetAllAsync()` |
| ローカル変数・引数 | キャメルケース | `todoId`, `isCompleted` |
| インターフェース | `I` プレフィックス + パスカルケース | `ITodoRepository` |
| 非同期メソッド | `Async` サフィックス | `CreateTodoAsync()` |
| プライベートフィールド | アンダースコア + キャメルケース | `_repository`, `_context` |
|  |  |  |

### 非同期処理

- DBアクセスを含むメソッドは必ず `async/await` を使用する
- 非同期メソッドには `Async` サフィックスをつける

```csharp
// Good
public async Task<IEnumerable<Todo>> GetAllAsync() { ... }

// Bad
public IEnumerable<Todo> GetAll() { ... }
```

### Null安全

- `<Nullable>enable</Nullable>` が有効（csproj設定済み）
- null許容参照型（`string?`）を適切に使用する
- null合体演算子（`??`）・null条件演算子（`?.`）を活用する

### セキュリティ

- ユーザー入力は DTOs でバリデーションを行う
- SQLインジェクション対策として生SQLは使用せず EF Core を使用する
- シークレット情報はソースコードに書かず、環境変数または `appsettings.json` を使用する

### アノテーション

メソッドを作成する際に XML ドキュメントコメントを記載すること。

```csharp
/// <summary>
/// 指定したIDのTodoを取得します。
/// </summary>
/// <param name="id">TodoのID</param>
/// <returns>該当するTodo。存在しない場合は null。</returns>
public async Task<Todo?> GetByIdAsync(int id) { ... }
```

### 変数の型

基本的にはvarを用いないこととする。例外としてforeachではvarを用いる。

```C#
// NG
var count = 0;
var name = "john"
// OK
int count = 0;
string name = "John"
```



---

## 単体テスト方針

### テストコードの品質

- テストは必ず実際の機能を検証すること
- `Assert.True(true)` のような意味のないアサーションは絶対に書かない
- モックは必要最小限にとどめ、実際の動作に近い形でテストする

### テストの種類

- **ブラックボックステスト:** 入力と出力のみを検証する（内部実装に依存しない）
- **ホワイトボックステスト:** 内部の分岐・境界値を意識して網羅的にテストする
- 正常系だけでなく、境界値・異常系・エラーケースも必ずテストする

### テストファイルの配置

`src/backend/tests/TodoApp.Api.Tests/` の中にテストファイルを作成する。フォルダ構成は `src/backend/src/TodoApp.Api/` と同じ構成にしてください。

### テスト実行コマンド

```bash
dotnet test                          # 全テスト実行
dotnet test --filter "ClassName"     # クラス指定で実行
```

---

## API ドキュメント（Scalar / OpenAPI）

### 概要

- `Microsoft.AspNetCore.OpenApi` でOpenAPI仕様（JSON）を自動生成する
- `Scalar.AspNetCore` でブラウザからAPIを確認・テストできるUIを提供する
- どちらも**開発環境のみ**で有効（`IsDevelopment()` でガード済み）

### アクセス URL

| 用途 | URL |
|------|-----|
| Scalar UI（API テスト） | `http://localhost:5000/scalar/v1` |
| OpenAPI 仕様 JSON | `http://localhost:5000/openapi/v1.json` |

### コントローラーへのアノテーション

Scalar UI に正確な情報を表示するため、コントローラーおよびアクションメソッドに以下のアノテーションを付けること。

```csharp
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TodosController : ControllerBase
{
    /// <summary>
    /// タスク一覧を取得します
    /// </summary>
    /// <response code="200">正常取得</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TodoResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll() { ... }

    /// <summary>
    /// タスクを作成します
    /// </summary>
    /// <response code="201">作成成功</response>
    /// <response code="400">バリデーションエラー</response>
    [HttpPost]
    [ProducesResponseType(typeof(TodoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateTodoRequest request) { ... }
}
```

- `[ProducesResponseType]` で全レスポンスコードを明示する
- XML ドキュメントコメント（`<summary>`, `<param>`, `<response>`）を必ず記載する（コーディング規約「アノテーション」と共通）

---

## コード品質チェック

コード変更後は必ず以下を実行し、エラーがないことを確認する。

```bash
dotnet build      # ビルド・コンパイルエラー確認
dotnet test       # 単体テスト
```
