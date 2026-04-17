# 要件定義書 — AWS EC2 CD（自動デプロイ）

**作成日:** 2026-04-17  
**ステータス:** ドラフト

---

## 1. 背景・目的

現在は CI（ビルド・テスト自動化）のみが整備されており、デプロイは手動。  
main ブランチへのマージ後に単一の AWS EC2 インスタンスへ自動デプロイされる仕組みを整備し、継続的デリバリーを実現する。  
あわせて AWS の基本的なインフラ操作（EC2・Security Group・Key Pair・Elastic IP）を習得する。

---

## 2. スコープ

| 対象 | 内容 |
|------|------|
| フロントエンド | Vite ビルド成果物を Nginx コンテナで配信 |
| バックエンド | .NET 9 API コンテナを EC2 上で実行 |
| DB | PostgreSQL コンテナを EC2 上で実行 |
| ワークフロー | GitHub Actions CD ワークフロー（`cd.yml`）の新規作成 |
| AWS リソース | EC2・Security Group・Key Pair・Elastic IP |
| GitHub Secrets | SSH 接続情報の登録 |

---

## 3. 機能要件

### FR-01: main マージ後の自動デプロイ

- main ブランチへの push をトリガーに、GitHub Actions CD ジョブが起動する
- GitHub Actions から SSH で EC2 に接続し、以下を実行する
  1. `git pull origin main`
  2. `docker compose up --build -d`

### FR-02: 単一 EC2 での全サービス稼働

- フロントエンド（Nginx）・バックエンド（.NET 9）・DB（PostgreSQL）を1台の EC2 上の docker compose で管理する
- 既存の `docker-compose.yml` を EC2 環境向けに調整して使用する

### FR-03: シークレット管理

- SSH 接続情報は GitHub Secrets で管理し、ワークフローファイルに直接書かない

| シークレット名 | 内容 |
|--------------|------|
| `EC2_HOST` | EC2 のパブリック IP アドレス |
| `EC2_USER` | SSH ログインユーザー（`ec2-user`） |
| `EC2_SSH_KEY` | SSH 秘密鍵（PEM 形式） |

---

## 4. 非機能要件

- CD ジョブは main へのマージ後 5 分以内にデプロイを開始すること
- EC2 は検証完了後に終了（削除）する前提とし、データ永続化は考慮しない
- 費用を最小化するため、インスタンスタイプは `t3.micro` を使用する

---

## 5. スコープ外

- HTTPS 対応（SSL 証明書の取得・設定）
- ステージング環境の構築
- デプロイ結果の通知（Slack・メール）
- RDS など AWS マネージド DB への移行

---

## 6. 前提条件

- AWS アカウントが作成済みであること（ユーザーが手動で実施）
- EC2 インスタンスが起動済みで、Docker・Git がインストール済みであること
