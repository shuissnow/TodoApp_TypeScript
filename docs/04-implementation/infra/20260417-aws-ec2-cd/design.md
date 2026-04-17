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

EC2 環境向けに `docker-compose.prod.yml` を新規作成する。  
既存の `docker-compose.yml`（開発用）は変更しない。

### サービス構成

```yaml
services:
  nginx:
    build: ./frontend        # Vite ビルド + Nginx
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    environment:
      - ConnectionStrings__DefaultConnection=...
      - JwtSettings__SecretKey=...
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      - POSTGRES_DB=todoapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=...
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

環境変数（DB パスワード・JWT キー）は EC2 上の `.env` ファイルで管理し、リポジトリには含めない。

### フロントエンド Dockerfile（本番用）

マルチステージビルドで Vite ビルド → Nginx 配信を行う。

```dockerfile
# Stage 1: ビルド
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: 配信
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

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
git clone https://github.com/<owner>/TodoApp.git ~/TodoApp

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
