# リポジトリ構造定義書

**バージョン:** 1.0
**作成日:** 2026-03-22
**ステータス:** ドラフト

---

## 1. 全体構成

```
TodoApp/
├── docs/                               # ドキュメント
│   ├── steering/                       # 作業単位のドキュメント（一時的）
│   │   └── 20260322-initial-implementation/
│   │       ├── requirements.md         # 要件定義
│   │       ├── design.md               # 設計メモ
│   │       └── tasklist.md             # タスク一覧
│   ├── commands/                       # コマンド手順書
│   │   ├── docker.md                   # Dockerコマンド手順書
│   │   └── postgres.md                 # PostgreSQLコマンド手順書
│   ├── product-requirements.md         # プロダクト要件
│   ├── functional-design.md            # 機能設計書
│   ├── architecture.md                 # アーキテクチャ概要
│   ├── repository-structure.md         # リポジトリ構成説明
│   ├── repository-structure-frontend.md  # フロントエンド構成詳細
│   ├── repository-structure-backend.md   # バックエンド構成詳細
│   ├── development-guidelines.md       # 開発ガイドライン
│   └── glossary.md                     # 用語集
├── src/
│   ├── frontend/                       # フロントエンド (詳細は repository-structure-frontend.md 参照)
│   ├── backend/                        # バックエンド (詳細は repository-structure-backend.md 参照)
│   ├── docker-compose.yml              # Docker ベース設定（開発・本番共通）
│   ├── docker-compose.dev.yml          # Docker 開発用オーバーライド
│   ├── docker-compose.prod.yml         # Docker 本番用オーバーライド
│   ├── .env                            # 環境変数（パスワード等）※ Git除外
│   └── .env.example                    # 環境変数テンプレート（Git管理）
├── .gitignore
├── .github/
│   └── workflows/
│       ├── frontend-deploy.yml         # フロントエンド CI/CD
│       └── backend-deploy.yml          # バックエンド CI/CD # TODO: バックエンド実装時に追加
├── CLAUDE.md                           # Claude Code プロジェクトメモリ
```

---

## 2. ドキュメント構成（`docs/`）

ドキュメントは **永続的ドキュメント** と **作業単位のドキュメント（steering/）** の2種類に分類されます。

### 永続的ドキュメント

アプリケーション全体の設計・方針を定義する恒久的なドキュメント。基本設計が変わらない限り更新されません。

| ファイル | 内容 |
|----------|------|
| `product-requirements.md` | プロダクトビジョン・ユーザーストーリー・受け入れ条件 |
| `functional-design.md` | コンポーネント設計・データモデル・画面遷移図 |
| `architecture.md` | テクノロジースタック・技術的制約・パフォーマンス要件 |
| `repository-structure.md` | TodoApp/ 直下のフォルダ・ファイル構成 |
| `repository-structure-frontend.md` | フロントエンドのフォルダ・ファイル構成 |
| `repository-structure-backend.md` | バックエンドのフォルダ・ファイル構成 |
| `development-guidelines.md` | コーディング規約・命名規則・Git規約 |
| `glossary.md` | ドメイン用語・英日対応表 |
| `commands/docker.md` | Dockerコマンド手順書 |
| `commands/postgres.md` | PostgreSQLコマンド手順書 |

### 作業単位のドキュメント（`steering/`）

特定の開発作業における「今回何をするか」を定義する一時的なドキュメント。作業完了後は履歴として保持されます。

```
steering/
└── YYYYMMDD-[開発タイトル]/
    ├── requirements.md     # 今回の要求内容・受け入れ条件
    ├── design.md           # 実装アプローチ・影響範囲
    └── tasklist.md         # 実装タスク一覧・進捗
```

---

## 3. Docker構成

### ファイル役割

| ファイル | 役割 |
|---------|------|
| `docker-compose.yml` | ベース設定。サービス定義・DBヘルスチェックなど共通設定を記述。パスワードは `.env` から `${変数名}` で参照 |
| `docker-compose.dev.yml` | 開発用オーバーライド。ソースコードのボリュームマウント、Vite開発サーバー起動、DBポート公開 |
| `docker-compose.prod.yml` | 本番用オーバーライド。nginx使用、自動再起動、DBポート非公開 |

### 起動コマンド

```bash
# src/ フォルダで実行すること
cd src

# 開発環境（ホットリロードあり）
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# 本番環境（バックグラウンド起動）
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 4. GitHub Actions構成（`.github/workflows/`）

> **TODO:** 内容を後で修正予定

### `frontend-deploy.yml`（v1.0）
- `main` ブランチへのpushをトリガー
- Dockerを使ってビルド
- AWS S3へデプロイ
- CloudFrontキャッシュを無効化

### `backend-deploy.yml`
> **TODO:** バックエンド実装時に内容を追加予定

- Dockerイメージをビルド
- AWS ECRにpush
- ECS Fargateにデプロイ

---

## 5. ファイル配置ルール

> **TODO:** 内容を後で修正予定

### 命名規則

| 対象 | 規則 | 例 |
|------|------|----|
| ディレクトリ | ケバブケース | `components/` |
| ステアリングディレクトリ | `YYYYMMDD-kebab-case` | `20260322-initial-implementation/` |

---

## 6. 環境変数

### `.env` ファイル

パスワード等のシークレット情報は `.env` に記述し、Git には含めません。
`.env.example` をコピーして `.env` を作成してください。

```bash
cd src
cp .env.example .env
# .env を編集してパスワードを設定
```

### `.env` の内容

```
POSTGRES_DB=todoapp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=（任意のパスワード）
```

docker-compose.yml 内では `${POSTGRES_PASSWORD}` のように参照します。

### `.gitignore` 対象

```
.env
.env.local
node_modules/
dist/
bin/
obj/
```
