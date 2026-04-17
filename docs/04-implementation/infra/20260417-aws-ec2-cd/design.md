# 設計書 — AWS EC2 CD（自動デプロイ）

**作成日:** 2026-04-17  
**ステータス:** ドラフト

---

## 1. アーキテクチャ概要

```
GitHub (main push)
  │
  ▼
GitHub Actions (cd.yml)
  │  SSH接続 (port 22)
  ▼
EC2 (t3.micro / Ubuntu 24.04 LTS)
  ├── Elastic IP（固定パブリック IP）
  └── docker compose
      ├── nginx      (port 80)  ← フロントエンド配信
      ├── backend    (internal) ← .NET 9 API
      └── db         (internal) ← PostgreSQL
```

外部からは port 80（HTTP）のみアクセス可能。  
backend・db はコンテナ内ネットワーク経由でのみ通信し、外部に公開しない。

---

## 2. AWS リソース設計

### EC2 インスタンス

| 項目 | 値 |
|------|-----|
| インスタンスタイプ | `t3.micro` |
| AMI | Ubuntu 24.04 LTS |
| ストレージ | gp3 8GB（デフォルト） |
| キーペア | 新規作成（`todoapp-key`） |

### Security Group

| ルール | タイプ | ポート | 送信元 |
|--------|--------|--------|--------|
| SSH | インバウンド | 22 | 自分の IP（`/32`） |
| HTTP | インバウンド | 80 | `0.0.0.0/0` |
| アウトバウンド | 全て | 全て | `0.0.0.0/0` |

SSH は自分の IP のみに制限し、不正アクセスを防ぐ。

### Elastic IP

- EC2 に Elastic IP を割り当て、再起動後も IP が変わらないようにする
- GitHub Secrets の `EC2_HOST` にこの IP を登録する

---

## 3. docker compose 設計

既存ファイルを活用し、EC2 専用のオーバーライドファイルを新規作成する。

| ファイル | 役割 | 変更 |
|---------|------|------|
| `docker-compose.yml` | ベース設定（開発・本番共通） | 変更なし |
| `docker-compose.prod.yml` | Aurora 本番用オーバーライド | 変更なし |
| `docker-compose.ec2.yml` | EC2 一時検証用オーバーライド | **新規作成** |

### EC2 起動コマンド

```bash
docker compose -f docker-compose.yml -f docker-compose.ec2.yml up --build -d
```

### `docker-compose.ec2.yml` の内容

```yaml
services:
  frontend:
    ports:
      - "80:80"
    restart: unless-stopped

  backend:
    restart: unless-stopped
    environment:
      - ASPNETCORE_ENVIRONMENT=Development  # 起動時にマイグレーション・シードを自動実行

  db:
    profiles: []  # docker-compose.prod.yml の profiles: [dev] を上書きし、ローカル DB を有効化
    restart: unless-stopped
```

### なぜ `ASPNETCORE_ENVIRONMENT=Development` か

- Development モードでは起動時にマイグレーションと admin ユーザーのシードが自動実行される
- フロントエンドと API は同一オリジン（Nginx がプロキシ）のため CORS は問題なし
- appsettings.Development.json の接続文字列より環境変数が優先されるため、ローカル DB に接続される

### `.env` ファイル（EC2 上で手動作成）

```
POSTGRES_DB=todoapp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<任意のパスワード>
```

### 既存ファイルの活用

| ファイル | 内容 | 変更 |
|---------|------|------|
| `frontend/Dockerfile` | マルチステージビルド（builder + nginx） | 変更なし |
| `frontend/nginx.conf` | `/api/` を `backend:8080` にプロキシ | 変更なし |
| `backend/Dockerfile` | .NET 9 ビルド・実行（ポート 8080） | 変更なし |

---

## 4. GitHub Actions CD ワークフロー設計

### ファイルパス

`.github/workflows/cd.yml`

### トリガー

```yaml
on:
  push:
    branches: [main]
```

### ジョブフロー

```
deploy ジョブ
  1. EC2 に SSH 接続
  2. git pull origin main
  3. docker compose -f docker-compose.prod.yml up --build -d
  4. 古いイメージのクリーンアップ（docker image prune -f）
```

### GitHub Secrets

| シークレット名 | 内容 |
|--------------|------|
| `EC2_HOST` | Elastic IP アドレス |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | PEM 秘密鍵の内容（改行含む） |

---

## 5. EC2 初期セットアップ手順（手動）

EC2 起動後、以下を SSH で実施する（一度だけ）。

```bash
# Docker インストール
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl git
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker ubuntu
newgrp docker

# リポジトリのクローン
git clone https://github.com/shuissnow/TodoApp_TypeScript.git ~/TodoApp

# .env ファイルの作成（DB パスワード・JWT キーを設定）
cp ~/TodoApp/src/.env.example ~/TodoApp/src/.env
vi ~/TodoApp/src/.env
```

---

## 6. デプロイ後の動作確認

| 確認項目 | 方法 |
|---------|------|
| フロントエンド表示 | ブラウザで `http://<Elastic IP>` にアクセス |
| API 疎通 | `curl http://<Elastic IP>/api/todos` |
| CD 自動実行 | main に push 後、GitHub Actions のログを確認 |

---

## 7. 削除手順（検証後）

1. EC2 インスタンスを**終了**（停止ではなく終了）
2. Elastic IP を**解放**（割り当て解除後に解放しないと課金が続く）
3. Key Pair を削除
4. Security Group を削除
