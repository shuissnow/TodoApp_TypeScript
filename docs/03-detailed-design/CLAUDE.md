# 03-detailed-design/ — Claude 向けガイド

## ファイル一覧

| ファイル | 内容 | 更新タイミング |
|---------|------|--------------|
| `repository-structure.md` | TodoApp/ 全体のフォルダ・ファイル構成 | ルート構成・Docker・GitHub Actions が変わるとき |
| `repository-structure-frontend.md` | `src/frontend/` のファイル構成と命名規則 | フロントエンド構成・命名規則が変わるとき |
| `repository-structure-backend.md` | `src/backend/` のファイル構成と命名規則 | バックエンド構成・命名規則が変わるとき |
| `development-guidelines.md` | Git規約・コミットメッセージ規約・セキュリティ規約 | 開発プロセス・規約が変わるとき |
| `glossary.md` | ドメイン用語・コード上の命名対応表（英日） | 新しい用語・クラス・メソッドが追加されるとき |

---

## どのファイルを更新するか

| 変更内容 | 更新ファイル | 対象セクション |
|---------|------------|--------------|
| ルートディレクトリにファイル追加 | `repository-structure.md` | § 1 全体構成 |
| Docker ファイルの役割変更 | `repository-structure.md` | § 3 Docker構成 |
| GitHub Actions ワークフローの変更 | `repository-structure.md` | § 4 GitHub Actions構成 |
| 環境変数（`src/.env`）の変更 | `repository-structure.md` | § 6 環境変数 |
| フロントエンドのディレクトリ構成変更 | `repository-structure-frontend.md` | § 1 フロントエンド構成 |
| フロントエンドの命名規則変更 | `repository-structure-frontend.md` | § 2 ファイル配置ルール |
| フロントエンド環境変数の追加 | `repository-structure-frontend.md` | § 3 環境変数 |
| バックエンドのディレクトリ構成変更 | `repository-structure-backend.md` | § 1 バックエンド構成 |
| バックエンドの命名規則変更 | `repository-structure-backend.md` | § 2 ファイル配置ルール |
| バックエンド環境変数の追加 | `repository-structure-backend.md` | § 3 環境変数 |
| Git・PR・コミット規約の変更 | `development-guidelines.md` | § 1 Git規約 |
| セキュリティ方針の変更 | `development-guidelines.md` | § 2 セキュリティ規約 |
| 新しいドメイン用語・クラス・メソッドの追加 | `glossary.md` | 該当セクション |

---

## 注意事項

- コード上の命名（クラス・メソッド・プロパティ）はすべて `glossary.md` に記録する
- 環境変数は各ファイルの「環境変数」セクションで一覧管理する（`repository-structure.md` は共通変数、各 FE/BE ファイルは固有変数）
- 更新時はバージョン番号をインクリメントすること
