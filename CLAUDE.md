# CLAUDE.md (プロジェクトメモリ)

## プロジェクト概要

タスクの作成・編集・削除・完了管理ができる Todo アプリです。

| レイヤー | 技術 |
|---------|------|
| フロントエンド | TypeScript / Vite / Tailwind CSS v4 |
| バックエンド | C# / .NET 9 / ASP.NET Core Web API |
| DB | PostgreSQL |
| インフラ | Docker / docker-compose |

---

## リポジトリ構造

```
TodoApp/
├── docs/          # ドキュメント（SDLCフェーズ別）
└── src/
    ├── .env
    ├── docker-compose*.yml
    ├── frontend/  # TypeScript + Vite + Tailwind CSS
    └── backend/   # C# + .NET 9 + EF Core
```

---

## CLAUDE.md マップ

作業内容に応じて参照先を切り替えること。CLAUDE.mdファイルを修正する際は各CLAUDE.mdの内容を確認し、重複がないことを確認すること。

| 作業内容 | 参照先 |
|---------|--------|
| ドキュメント作成・更新 | `docs/CLAUDE.md` |
| FE / BE どちらか判断 | `src/CLAUDE.md` |
| フロントエンド TypeScript コード | `src/frontend/src/CLAUDE.md` |
| フロントエンド設定ファイル・Docker | `src/frontend/CLAUDE.md` |
| バックエンド C# コード | `src/backend/CLAUDE.md` |

---

## 機能追加・修正時の開発プロセス

1. **影響分析** — 永続的ドキュメント（`docs/01〜03`）への影響を確認
2. **作業ディレクトリ作成** — `docs/04-implementation/[frontend|backend]/YYYYMMDD-[title]/`
3. **ドキュメント作成** — `requirements.md` → `design.md` → `tasklist.md`（1ファイルごとに承認）
4. **実装** — `tasklist.md` に従う（詳細ルールは各 CLAUDE.md 参照）
5. **品質チェック** — 各 CLAUDE.md のチェック手順を実行
