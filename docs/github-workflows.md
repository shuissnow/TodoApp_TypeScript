# GitHub Actions ワークフロー ドキュメント

このドキュメントでは、`.github/workflows/` 以下に定義されている GitHub Actions ワークフローの設定について説明します。

---

## ワークフロー一覧

| ファイル名 | ワークフロー名 | 概要 |
|---|---|---|
| `claude.yml` | Claude Code | Issue・PRへの `@claude` メンションに応答する |
| `claude-code-review.yml` | Claude Code Review | PRが作成・更新されたときに自動コードレビューを行う |

---

## claude.yml — Claude Code

### 概要

Issue コメント、PR コメント、PR レビュー、Issue 本文に `@claude` が含まれる場合に Claude が自動的に応答するワークフローです。

### トリガー条件

| イベント | タイプ | 条件 |
|---|---|---|
| `issue_comment` | `created` | コメント本文に `@claude` を含む |
| `pull_request_review_comment` | `created` | コメント本文に `@claude` を含む |
| `pull_request_review` | `submitted` | レビュー本文に `@claude` を含む |
| `issues` | `opened`, `assigned` | Issue 本文またはタイトルに `@claude` を含む |

### 必要なパーミッション

| パーミッション | レベル | 用途 |
|---|---|---|
| `contents` | `read` | リポジトリのコード読み取り |
| `pull-requests` | `read` | PR 情報の読み取り |
| `issues` | `read` | Issue 情報の読み取り |
| `id-token` | `write` | 認証トークンの発行 |
| `actions` | `read` | CI 結果の読み取り（PR 上） |

### ステップ

1. **Checkout repository** — `actions/checkout@v4` でコードをチェックアウト（`fetch-depth: 1`）
2. **Run Claude Code** — `anthropics/claude-code-action@v1` を使って Claude を実行

### 必要なシークレット

| シークレット名 | 説明 |
|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | Claude Code の OAuth トークン |

### カスタマイズ

- `prompt` パラメーターで Claude へのプロンプトを固定することができます（未指定の場合は `@claude` を含むコメントの内容が使用されます）
- `claude_args` パラメーターで追加オプションを指定できます（例: `--allowed-tools Bash(gh pr:*)`）

---

## claude-code-review.yml — Claude Code Review

### 概要

PR が作成・更新・レビュー準備完了・再オープンされた際に、Claude が自動的にコードレビューを行うワークフローです。

### トリガー条件

| イベント | タイプ |
|---|---|
| `pull_request` | `opened`, `synchronize`, `ready_for_review`, `reopened` |

### 必要なパーミッション

| パーミッション | レベル | 用途 |
|---|---|---|
| `contents` | `read` | リポジトリのコード読み取り |
| `pull-requests` | `read` | PR 情報の読み取り |
| `issues` | `read` | Issue 情報の読み取り |
| `id-token` | `write` | 認証トークンの発行 |

### ステップ

1. **Checkout repository** — `actions/checkout@v4` でコードをチェックアウト（`fetch-depth: 1`）
2. **Run Claude Code Review** — `anthropics/claude-code-action@v1` を使って Claude Code Review プラグインを実行

### 設定パラメーター

| パラメーター | 値 | 説明 |
|---|---|---|
| `claude_code_oauth_token` | `${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}` | 認証トークン |
| `plugin_marketplaces` | `https://github.com/anthropics/claude-code.git` | プラグインマーケットプレイスの URL |
| `plugins` | `code-review@claude-code-plugins` | 使用するプラグイン |
| `prompt` | `/code-review:code-review <repo>/pull/<PR番号>` | Claude へのプロンプト |

### 必要なシークレット

| シークレット名 | 説明 |
|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | Claude Code の OAuth トークン |

### カスタマイズ

- `if` 条件を追加することで、特定の PR 作成者（外部コントリビューター、初回コントリビューターなど）のみにレビューを絞ることができます
- `paths` フィルターで特定のファイル変更時のみ実行するよう設定できます（例: `src/**/*.ts`）

---

## セットアップ手順

1. リポジトリの **Settings > Secrets and variables > Actions** に移動する
2. `CLAUDE_CODE_OAUTH_TOKEN` を追加する（Claude Code のトークンを設定）
3. ワークフローファイルが `.github/workflows/` に存在することを確認する

## 参考リンク

- [claude-code-action GitHub リポジトリ](https://github.com/anthropics/claude-code-action)
- [Claude Code Action 使用方法ドキュメント](https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md)
- [Claude Code CLI リファレンス](https://code.claude.com/docs/en/cli-reference)
