# CLAUDE.md (プロジェクトメモリ)

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| 言語・FW | C# / .NET 9 / ASP.NET Core Web API |
| ORM・DB | Entity Framework Core 9 / PostgreSQL（Npgsql） |
| テスト | xUnit + Moq |
| API ドキュメント | Microsoft.AspNetCore.OpenApi + Scalar.AspNetCore |

---

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

## 作業ルール

- 各作業の詳細手順は以下のスキルに従う

| 作業内容 | スキル |
|---------|--------|
| コード実装 | `implement-code-csharp` |
| 単体テスト | `implement-unittest-csharp` |
| リファクタリング | `refactor-code-csharp` |
| SQL・マイグレーション | `implement-sql` |
| コード解説 | `explain-code-csharp` |

---

## API ドキュメント（Scalar / OpenAPI）

Scalar は `ASPNETCORE_ENVIRONMENT=Development` のときのみ有効（`docker-compose.dev.yml` 使用時）。

### ローカル起動時（`dotnet run`）

| 用途 | URL |
|------|-----|
| Scalar UI（API テスト） | `http://localhost:5243/scalar/v1` |
| OpenAPI 仕様 JSON | `http://localhost:5243/openapi/v1.json` |

### Docker 起動時（`docker-compose.dev.yml` 使用時）

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

| 用途 | URL |
|------|-----|
| Scalar UI（API テスト） | `http://localhost:8080/scalar/v1` |
| OpenAPI 仕様 JSON | `http://localhost:8080/openapi/v1.json` |
