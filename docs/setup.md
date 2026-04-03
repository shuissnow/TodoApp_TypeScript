# 開発プロセス手順書

このドキュメントは、新規開発・機能追加・修正を行う際の標準手順を定義します。

---

## 1. 初回セットアップ時の手順

### 1-1. フォルダ作成

**ドキュメント:**

```bash
mkdir -p docs/01-requirements
mkdir -p docs/02-basic-design
mkdir -p docs/03-detailed-design
mkdir -p docs/04-implementation/frontend
mkdir -p docs/04-implementation/backend
mkdir -p docs/04-implementation/runbooks
mkdir -p docs/05-unit-test
mkdir -p docs/06-integration-test
mkdir -p docs/07-system-test
```

**ソースコード:**

```bash
mkdir -p src/frontend
mkdir -p src/backend
```

### 1-2. git 初期化

```bash
git init
```

`.gitignore` を作成し、以下を最低限含めること。

```
node_modules/
dist/
bin/
obj/
.env
```

### 1-3. 環境変数ファイルの準備

`src/.env.example` を作成し、必要な環境変数のキーを列挙します（値は空またはダミー値）。

```bash
cp src/.env.example src/.env
```

`.env` に実際の値を設定します。`.env` は `.gitignore` に含め、リポジトリにコミットしないこと。

### 1-4. 永続的ドキュメントの作成

アプリケーション全体の設計を定義します。**1ファイルごとに確認・承認を得てから次に進みます。**

| 順番 | ファイルパス | 内容 |
|------|------------|------|
| 1 | `docs/01-requirements/product-requirements.md` | プロダクトビジョン、ユーザーストーリー、機能要件 |
| 2 | `docs/02-basic-design/functional-design.md` | データモデル、画面遷移、API設計 |
| 3 | `docs/02-basic-design/architecture.md` | 技術スタック、インフラ構成 |
| 4 | `docs/03-detailed-design/repository-structure.md` | フォルダ・ファイル構成 |
| 5 | `docs/03-detailed-design/development-guidelines.md` | コーディング規約、Git規約 |
| 6 | `docs/03-detailed-design/glossary.md` | ユビキタス言語定義 |

### 1-5. CLAUDE.md の配置

Claude が作業する各フォルダに CLAUDE.md を作成します。**1ファイルごとに確認・承認を得てから次に進みます。**

| ファイル | 記載内容 |
|---------|---------|
| `CLAUDE.md` | プロジェクト概要、リポジトリ構造、CLAUDE.md マップ、開発プロセス |
| `docs/CLAUDE.md` | ドキュメント選択ガイド、作業単位ドキュメントの作り方、禁止事項 |
| `src/CLAUDE.md` | FE / BE の作業判断マトリクス、共通ルール |
| `src/frontend/CLAUDE.md` | 設定ファイル・Docker の変更ルール、承認が必要なファイル一覧 |
| `src/frontend/src/CLAUDE.md` | コーディング規約、作業順番、品質チェックコマンド |
| `src/backend/CLAUDE.md` | コーディング規約、テスト方針、品質チェックコマンド |

### 1-6. 環境セットアップ

`docs/04-implementation/runbooks/` 内の各手順書を参照してください。

### 1-7. 初回実装

「2. 機能追加・修正時の手順」に従い、以下のディレクトリから開始します。

```bash
mkdir -p docs/04-implementation/frontend/YYYYMMDD-initial-implementation
```

---

## 2. 機能追加・修正時の手順

### Step 1: 影響分析

- 永続的ドキュメント（`docs/01〜03`）への影響を確認する
- 設計・仕様の変更が必要な場合は、該当するドキュメントを更新してから実装に進む

### Step 2: 作業ディレクトリ作成

```bash
mkdir -p docs/04-implementation/frontend/YYYYMMDD-[開発タイトル]
# または
mkdir -p docs/04-implementation/backend/YYYYMMDD-[開発タイトル]
```

**例:**

```bash
mkdir -p docs/04-implementation/frontend/20260115-add-tag-feature
mkdir -p docs/04-implementation/backend/20260420-add-auth
```

### Step 3: 作業ドキュメント作成

以下の順番で作成し、**1ファイルごとに確認・承認を得てから次に進みます。**

| 順番 | ファイル | 内容 |
|------|--------|------|
| 1 | `requirements.md` | 変更・追加する機能の説明、ユーザーストーリー、受け入れ条件 |
| 2 | `design.md` | 実装アプローチ、変更するコンポーネント、影響範囲 |
| 3 | `tasklist.md` | 具体的な実装タスクと完了条件 |

### Step 4: 実装

`tasklist.md` のタスクに従って実装を進めます。詳細なコーディング規約・テスト方針は各 CLAUDE.md を参照してください。

### Step 5: 品質チェック

各 CLAUDE.md に記載されているチェックコマンドを実行し、エラーがないことを確認してからコミットします。

---

## 3. ドキュメント管理の原則

| 種別 | 対象 | 更新タイミング |
|------|------|--------------|
| 永続的ドキュメント | `docs/01〜03` | 設計・仕様の根本的な変更があったときのみ |
| 作業単位ドキュメント | `docs/04-implementation/[frontend\|backend]/YYYYMMDD-[title]/` | 開発作業のたびに新規フォルダを作成 |

- 作業完了後も過去の作業フォルダは削除しない（意思決定の履歴として保持）
- 過去の作業フォルダの内容を修正しない
