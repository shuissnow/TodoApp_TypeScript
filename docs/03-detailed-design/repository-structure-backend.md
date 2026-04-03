# バックエンド リポジトリ構造定義書

**バージョン:** 1.1
**作成日:** 2026-03-22
**ステータス:** ドラフト

---

## 1. バックエンド構成（`backend/`）

```
backend/
├── src/                                # ソースコード
├── tests/                              # テストコード
├── TodoApp.sln                         # ソリューションファイル
└── Dockerfile                          # バックエンド用 Dockerfile
```

---

## 2. ファイル配置ルール

### 命名規則

| 対象 | 規則 | 例 |
|------|------|----|
| C# ファイル | パスカルケース | `TodosController.cs` |
| インターフェースファイル | `I` プレフィックス + パスカルケース | `ITodoService.cs` |
| テストファイル | 対象クラス名 + `Tests.cs` | `TodoServiceTests.cs` |

### ファイル配置の原則
- コントローラーは `Controllers/` に配置
- エンティティは `Models/` に配置
- リクエスト/レスポンス DTO は `DTOs/` に配置
- ビジネスロジックは `Services/` に配置（インターフェースと実装を同一ディレクトリに配置）
- DBアクセスは `Repositories/` に配置（インターフェースと実装を同一ディレクトリに配置）
- DB コンテキスト・マイグレーションは `Data/` に配置
- テストコードは `tests/` に配置（`src/` と同じディレクトリ構成）

---

## 3. 環境変数

### バックエンド（`appsettings.json` / 環境変数）

| 変数名 | 説明 | v1.0 |
|--------|------|------|
| `ConnectionStrings__DefaultConnection` | PostgreSQL 接続文字列 | 使用中 |
| `JWT_SECRET` | JWT 署名キー | 未使用（将来使用） |
| `COGNITO_USER_POOL_ID` | Cognito ユーザープールID | 未使用（将来使用） |
