# Dockerコマンド手順書

**作成日:** 2026-03-30

---

## このプロジェクトでの起動コマンド

```bash
# 作業ディレクトリへ移動（必須）
cd C:\Users\shuki\Claude\TodoApp\src

# 開発環境を起動（ホットリロードあり）
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# バックグラウンドで起動する場合
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 本番環境を起動
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

> **注意:** `-f` でファイルを指定しているため、**必ず TodoApp/src フォルダで実行**すること。
> 別のディレクトリで実行すると `no configuration file provided: not found` エラーになる。

---

## サービス構成

```
┌─────────────────────────────────────────────────────┐
│                   Docker Network                     │
│                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │  frontend  │  │  backend   │  │     db     │    │
│  │  :5173     │◀▶│  :8080     │◀▶│  :5432     │    │
│  │  (Vite)    │  │  (ASP.NET) │  │ (Postgres) │    │
│  └────────────┘  └────────────┘  └────────────┘    │
└─────────────────────────────────────────────────────┘

アクセス先（開発環境）:
  フロントエンド: http://localhost:5173
  バックエンド:   http://localhost:8080
  DB:            localhost:5432
```

---

## docker compose コマンド

### 起動・停止

| コマンド | 説明 |
|---------|------|
| `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` | 開発環境を起動（フォアグラウンド） |
| `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d` | 開発環境をバックグラウンドで起動 |
| `docker compose -f docker-compose.yml -f docker-compose.dev.yml down` | コンテナを停止して削除 |
| `docker compose -f docker-compose.yml -f docker-compose.dev.yml stop` | コンテナを停止（削除しない） |
| `docker compose -f docker-compose.yml -f docker-compose.dev.yml start` | 停止中のコンテナを再起動 |
| `docker compose -f docker-compose.yml -f docker-compose.dev.yml restart` | コンテナを再起動 |

### 確認

| コマンド | 説明 |
|---------|------|
| `docker compose -f docker-compose.yml -f docker-compose.dev.yml ps` | コンテナの起動状態を確認 |
| `docker compose -f docker-compose.yml -f docker-compose.dev.yml logs` | 全サービスのログを表示 |
| `docker compose -f docker-compose.yml -f docker-compose.dev.yml logs frontend` | frontendのログのみ表示 |
| `docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f backend` | backendのログをリアルタイムで表示 |

### コンテナ内への操作

| コマンド | 説明 |
|---------|------|
| `docker compose -f docker-compose.yml -f docker-compose.dev.yml exec db bash` | dbコンテナのbashに入る |
| `docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend bash` | backendコンテナのbashに入る |

---

## docker（単体）コマンド

### イメージ操作

| コマンド | 説明 |
|---------|------|
| `docker images` | ローカルのイメージ一覧を表示 |
| `docker pull nginx` | Docker HubからイメージをPull |
| `docker rmi イメージID` | イメージを削除 |
| `docker build -t 名前:タグ .` | Dockerfileからイメージをビルド |

### コンテナ操作

| コマンド | 説明 |
|---------|------|
| `docker ps` | 起動中のコンテナ一覧 |
| `docker ps -a` | 停止中も含む全コンテナ一覧 |
| `docker stop コンテナ名` | コンテナを停止 |
| `docker start コンテナ名` | コンテナを起動 |
| `docker rm コンテナ名` | コンテナを削除（停止後に実行） |
| `docker logs コンテナ名` | コンテナのログを表示 |
| `docker logs -f コンテナ名` | コンテナのログをリアルタイム表示 |
| `docker exec -it コンテナ名 bash` | コンテナ内のbashに入る |

### ボリューム操作

| コマンド | 説明 |
|---------|------|
| `docker volume ls` | ボリューム一覧を表示 |
| `docker volume rm ボリューム名` | ボリュームを削除 |
| `docker volume inspect ボリューム名` | ボリュームの詳細を表示 |

---

## STATUS の見方

`docker compose ps` で確認できるコンテナの状態：

| STATUS | 意味 |
|--------|------|
| `running` | 正常に起動中 |
| `running (healthy)` | 起動中 + ヘルスチェックOK（dbはこの状態になる） |
| `starting` | 起動処理中（しばらく待つ） |
| `exited` | 停止・クラッシュしている → logsで原因確認 |
| `restarting` | 再起動を繰り返している（異常） → logsで原因確認 |

---

## よくあるトラブルと対処

### コンテナが起動しない

```bash
# ログで原因を確認する
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs サービス名
```

### ポートが競合している

```bash
# 別のプロセスが同じポートを使っている場合
# 起動中のコンテナを確認
docker ps

# 全コンテナを停止・削除してから再起動
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### イメージを最新に更新したい

```bash
# イメージを再ビルドして起動
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### DBのデータをリセットしたい

```bash
# コンテナとボリュームをまとめて削除（データが消えるので注意）
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

### 不要なイメージ・コンテナをまとめて削除したい

```bash
# 停止中のコンテナ、未使用イメージ、未使用ボリュームを一括削除
docker system prune
```

---

## -f オプションのしくみ

```
docker compose  -f docker-compose.yml  +  -f docker-compose.dev.yml
                      ↓                          ↓
                   ベース設定                  開発用の追加・上書き設定
                （全環境共通）              （ポート公開・ボリューム等）
                      ↓                          ↓
                      └──────── マージ ──────────┘
                                   ↓
                            最終的な設定として適用
```

後から読み込んだファイルの設定が優先されます。
同じキーは上書き、リスト（ports, volumes等）は結合されます。
